const Bid = require('../models/Bid');

// Rank bids by multiple criteria
exports.rankBidsByRFQ = async (rfqId) => {
  try {
    const bids = await Bid.find({ rfqId });

    if (bids.length === 0) {
      return;
    }

    // Sort by amount (price is primary factor)
    const rankedBids = bids.sort((a, b) => a.amount - b.amount);

    // Assign ranks
    for (let i = 0; i < rankedBids.length; i++) {
      rankedBids[i].rank = i + 1;
      await rankedBids[i].save();
    }

    return rankedBids;
  } catch (error) {
    console.error('Error ranking bids:', error);
    throw error;
  }
};

// Calculate bid score based on multiple factors
exports.calculateBidScore = (bid, supplier) => {
  let score = 100;

  // Price factor (40%)
  score -= bid.amount * 0.4;

  // Supplier rating factor (30%)
  if (supplier && supplier.rating) {
    score += supplier.rating * 6; // Max 30 points
  }

  // Delivery date factor (20%)
  const daysToDeliver = Math.floor(
    (new Date(bid.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  if (daysToDeliver < 7) {
    score += 15;
  } else if (daysToDeliver < 14) {
    score += 10;
  } else if (daysToDeliver < 30) {
    score += 5;
  }

  // Supplier win history factor (10%)
  if (supplier && supplier.winCount) {
    score += Math.min(supplier.winCount, 10); // Max 10 points
  }

  return Math.round(score);
};

// Get ranked bids with scores
exports.getRankedBidsWithScores = async (rfqId, suppliers = {}) => {
  try {
    const bids = await Bid.find({ rfqId }).sort({ amount: 1 });

    const rankedBids = bids.map((bid, index) => ({
      ...bid.toObject(),
      rank: index + 1,
      score: this.calculateBidScore(bid, suppliers[bid.supplierId]),
    }));

    return rankedBids;
  } catch (error) {
    console.error('Error getting ranked bids:', error);
    throw error;
  }
};
