// routes/about.js
const express = require('express');
const router = express.Router();
const { createInfo, getInfo, updateInfo } = require('../controllers/info');

router.post('/admin/site-info', createInfo); // Create About
router.get('/admin/site-info', getInfo); // Get About
router.put('/admin/site-info', updateInfo); // Update About

module.exports = router;