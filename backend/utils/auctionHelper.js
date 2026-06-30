const RFQ = require('../models/RFQ');
const Bid = require('../models/Bid');
const ActivityLog = require('../models/ActivityLog');

// Check if auction is expired
exports.isAuctionExpired = (endDate) => {
  return new Date() > new Date(endDate);
};

// Close auction and select winner
exports.closeAuction = async (rfqId) => {
  try {
    const rfq = await RFQ.findById(rfqId);
    if (!rfq) {
      throw new Error('RFQ not found');
    }

    // Get the winning bid (lowest amount)
    const winningBid = await Bid.findOne({ rfqId })
      .sort({ amount: 1 })
      .exec();

    if (!winningBid) {
      rfq.status = 'closed';
      await rfq.save();
      return null;
    }

    // Update bid status
    winningBid.status = 'accepted';
    await winningBid.save();

    // Update other bids
    await Bid.updateMany(
      { rfqId, _id: { $ne: winningBid._id } },
      { status: 'rejected' }
    );

    // Update RFQ status
    rfq.status = 'closed';
    await rfq.save();

    // Log activity
    await ActivityLog.create({
      rfqId,
      action: 'Auction Closed',
      details: `Auction closed. Winner: ${winningBid.supplierId} with amount $${winningBid.amount}`,
      performedBy: 'system',
    });

    return winningBid;
  } catch (error) {
    console.error('Error closing auction:', error);
    throw error;
  }
};

// Get auction statistics
exports.getAuctionStats = async (rfqId) => {
  try {
    const bids = await Bid.find({ rfqId });
    const acceptedBids = bids.filter((b) => b.status === 'accepted');
    const rejectedBids = bids.filter((b) => b.status === 'rejected');

    return {
      totalBids: bids.length,
      acceptedBids: acceptedBids.length,
      rejectedBids: rejectedBids.length,
      lowestBid: Math.min(...bids.map((b) => b.amount)),
      highestBid: Math.max(...bids.map((b) => b.amount)),
      averageBid:
        bids.reduce((sum, b) => sum + b.amount, 0) / bids.length || 0,
    };
  } catch (error) {
    console.error('Error getting auction stats:', error);
    throw error;
  }
};
