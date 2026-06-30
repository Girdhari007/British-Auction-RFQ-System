const Bid = require('../models/Bid');
const ActivityLog = require('../models/ActivityLog');
const rankingHelper = require('../utils/rankingHelper');

// Get all bids for an RFQ
exports.getBidsByRFQ = async (req, res) => {
  try {
    const bids = await Bid.find({ rfqId: req.params.rfqId }).sort({
      amount: 1,
    });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bid by ID
exports.getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new bid
exports.createBid = async (req, res) => {
  try {
    const bid = new Bid(req.body);
    await bid.save();

    // Re-rank bids
    await rankingHelper.rankBidsByRFQ(bid.rfqId);

    // Log activity
    await ActivityLog.create({
      rfqId: bid.rfqId,
      action: 'Bid Submitted',
      details: `New bid submitted by supplier ${bid.supplierId}`,
      performedBy: bid.supplierId,
      metadata: { bidId: bid._id, amount: bid.amount },
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update bid
exports.updateBid = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Re-rank bids
    await rankingHelper.rankBidsByRFQ(bid.rfqId);

    // Log activity
    await ActivityLog.create({
      rfqId: bid.rfqId,
      action: 'Bid Updated',
      details: `Bid updated by supplier ${bid.supplierId}`,
      performedBy: bid.supplierId,
    });

    res.json(bid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete bid
exports.deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndDelete(req.params.id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Re-rank bids
    await rankingHelper.rankBidsByRFQ(bid.rfqId);

    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
