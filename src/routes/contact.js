const express = require('express');
const router = express.Router();
const { createContact, getContact, updateContact } = require('../controllers/contact');

// Admin routes for managing contact
router.post('/admin/contact', createContact); // Create Contact
router.get('/admin/contact', getContact); // Get Contact
router.put('/admin/contact', updateContact); // Update Contact

module.exports = router;