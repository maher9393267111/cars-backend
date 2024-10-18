// routes/offer.js
const express = require('express');
const router = express.Router();
const { createOffer, getOffers, updateOffers, deleteOffer } = require('../controllers/offer');

router.post('/admin/offers', createOffer);
router.get('/admin/offers', getOffers);
router.put('/admin/offers', updateOffers);
router.delete('/admin/offers/:offerId', deleteOffer);

module.exports = router;
