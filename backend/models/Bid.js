const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    rfqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RFQ',
      required: true,
    },
    supplierId: {
      type: String,
      required: true,
    },
    carrierName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    freightCharges: {
      type: Number,
      default: 0,
    },
    originCharges: {
      type: Number,
      default: 0,
    },
    destinationCharges: {
      type: Number,
      default: 0,
    },
    transitTime: {
      type: String,
    },
    validityDays: {
      type: Number,
      default: 7,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    rank: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bid', bidSchema);
