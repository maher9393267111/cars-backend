// routes/about.js
const express = require('express');
const router = express.Router();
const { createAbout, getAbout, updateAbout } = require('../controllers/about');

router.post('/admin/about', createAbout); // Create About
router.get('/admin/about', getAbout); // Get About
router.put('/admin/about', updateAbout); // Update About

module.exports = router;