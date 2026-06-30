const RFQ = require('../models/RFQ');
const ActivityLog = require('../models/ActivityLog');

// Get all RFQs
exports.getAllRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find();
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

// Create new RFQ
exports.createRFQ = async (req, res) => {
  try {
    const rfq = new RFQ(req.body);
    await rfq.save();

    // Log activity
    await ActivityLog.create({
      rfqId: rfq._id,
      action: 'RFQ Created',
      details: `RFQ "${rfq.title}" created`,
      performedBy: req.body.createdBy,
    });

    res.status(201).json(rfq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update RFQ
exports.updateRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ not found' });
    }

    // Log activity
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
