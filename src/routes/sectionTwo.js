const express = require('express');
const router = express.Router();
const { createSection, getSection, updateSection, getAllSections } = require('../controllers/sectionTwo');

router.post('/admin/section2', createSection); // Create Section
router.get('/admin/section2', getSection); // Get Single Section
router.get('/admin/sections2', getAllSections); // Get All Sections
router.put('/admin/section2', updateSection); // Update Section

module.exports = router;