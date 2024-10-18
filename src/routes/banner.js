// routes/about.js
const express = require('express');
const router = express.Router();
const { createBanner, getBanner, updateBanner } = require('../controllers/banner');

router.post('/admin/banner', createBanner); // Create About
router.get('/admin/banner', getBanner); // Get About
router.put('/admin/banner', updateBanner); // Update About

module.exports = router;