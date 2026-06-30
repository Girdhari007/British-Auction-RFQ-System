const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqController');

// RFQ routes
router.get('/', rfqController.getAllRFQs);
router.get('/:id/bids', rfqController.getRFQBids);
router.get('/:id/activities', rfqController.getRFQActivities);
router.get('/:id', rfqController.getRFQById);
router.post('/', rfqController.createRFQ);
router.put('/:id', rfqController.updateRFQ);
router.delete('/:id', rfqController.deleteRFQ);

module.exports = router;
