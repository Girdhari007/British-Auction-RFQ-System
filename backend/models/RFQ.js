const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'cancelled'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    bidCloseDate: {
      type: Date,
      required: true,
    },
    forcedCloseDate: {
      type: Date,
      required: true,
    },
    triggerWindowMinutes: {
      type: Number,
      default: 10,
      min: 1,
    },
    extensionMinutes: {
      type: Number,
      default: 5,
      min: 1,
    },
    pickupDate: {
      type: Date,
    },
    budget: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RFQ', rfqSchema);
