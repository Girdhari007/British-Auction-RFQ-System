const RFQ = require('../models/RFQ');
const Bid = require('../models/Bid');
const ActivityLog = require('../models/ActivityLog');
const rankingHelper = require('../utils/rankingHelper');

const maybeExtendAuction = async (rfq) => {
  const now = new Date();
  const triggerStart = new Date(rfq.bidCloseDate.getTime() - rfq.triggerWindowMinutes * 60000);

  if (!rfq.bidCloseDate || !rfq.forcedCloseDate) {
    return false;
  }

  const isInTriggerWindow = now >= triggerStart && now < new Date(rfq.bidCloseDate);
  const canStillExtend = new Date(rfq.bidCloseDate) < new Date(rfq.forcedCloseDate);

  if (!isInTriggerWindow || !canStillExtend) {
    return false;
  }

  const extendedCloseTime = new Date(
    Math.min(
      new Date(rfq.bidCloseDate).getTime() + rfq.extensionMinutes * 60000,
      new Date(rfq.forcedCloseDate).getTime()
    )
  );

  if (extendedCloseTime.getTime() === new Date(rfq.bidCloseDate).getTime()) {
    return false;
  }

  rfq.bidCloseDate = extendedCloseTime;
  await rfq.save();

  await ActivityLog.create({
    rfqId: rfq._id,
    action: 'Auction Extended',
    details: `Auction extended by ${rfq.extensionMinutes} minutes because a bid arrived in the trigger window.`,
    performedBy: 'system',
    metadata: { newCloseTime: extendedCloseTime },
  });

  return true;
};

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
    const rfq = await RFQ.findById(req.body.rfqId);
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ not found' });
    }

    if (new Date() > new Date(rfq.bidCloseDate)) {
      return res.status(400).json({ error: 'Auction is already closed' });
    }

    const bid = new Bid(req.body);
    await bid.save();

    await rankingHelper.rankBidsByRFQ(bid.rfqId);
    const wasExtended = await maybeExtendAuction(rfq);

    await ActivityLog.create({
      rfqId: bid.rfqId,
      action: 'Bid Submitted',
      details: wasExtended
        ? `New bid submitted and the auction was extended.`
        : `New bid submitted by supplier ${bid.supplierId}`,
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

    await rankingHelper.rankBidsByRFQ(bid.rfqId);

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

    await rankingHelper.rankBidsByRFQ(bid.rfqId);

    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
