const RFQ = require('../models/RFQ');
const Bid = require('../models/Bid');
const ActivityLog = require('../models/ActivityLog');

const validateRfqData = (data) => {
  if (data.bidCloseDate && data.forcedCloseDate) {
    if (new Date(data.forcedCloseDate) <= new Date(data.bidCloseDate)) {
      throw new Error('Forced bid close time must be later than bid close time');
    }
  }

  if (data.triggerWindowMinutes !== undefined && data.triggerWindowMinutes < 1) {
    throw new Error('Trigger window must be at least 1 minute');
  }

  if (data.extensionMinutes !== undefined && data.extensionMinutes < 1) {
    throw new Error('Extension duration must be at least 1 minute');
  }
};

// Get all RFQs
exports.getAllRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find().sort({ createdAt: -1 });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get RFQ by ID
exports.getRFQById = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ not found' });
    }
    res.json(rfq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bids for one RFQ
exports.getRFQBids = async (req, res) => {
  try {
    const bids = await Bid.find({ rfqId: req.params.id }).sort({ amount: 1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get activity log for one RFQ
exports.getRFQActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({ rfqId: req.params.id }).sort({ timestamp: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new RFQ
exports.createRFQ = async (req, res) => {
  try {
    const rfqData = {
      ...req.body,
      referenceId: req.body.referenceId || `RFQ-${Date.now()}`,
    };

    validateRfqData(rfqData);

    const rfq = new RFQ(rfqData);
    await rfq.save();

    await ActivityLog.create({
      rfqId: rfq._id,
      action: 'RFQ Created',
      details: `RFQ "${rfq.title}" was created`,
      performedBy: req.body.createdBy || 'system',
    });

    res.status(201).json(rfq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update RFQ
exports.updateRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ not found' });
    }

    Object.assign(rfq, req.body);
    validateRfqData(rfq.toObject());
    await rfq.save();

    await ActivityLog.create({
      rfqId: rfq._id,
      action: 'RFQ Updated',
      details: 'RFQ was updated',
      performedBy: req.body.updatedBy || 'system',
    });

    res.json(rfq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete RFQ
exports.deleteRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndDelete(req.params.id);
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ not found' });
    }
    res.json({ message: 'RFQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
