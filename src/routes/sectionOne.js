// routes/about.js
const express = require('express');
const router = express.Router();
const { createSection, getSection, updateSection } = require('../controllers/sectionOne');

router.post('/admin/sectionone', createSection); // Create About
router.get('/admin/sectionone', getSection); // Get About
router.put('/admin/sectionone', updateSection); // Update About

module.exports = router;