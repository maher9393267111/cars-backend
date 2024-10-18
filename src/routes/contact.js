const express = require('express');
const router = express.Router();
const { createContact, getContact, updateContact ,getMeAdminContacts } = require('../controllers/contact');

// Admin routes for managing contact
router.post('/admin/contact', createContact); // Create Contact
router.get('/admin/contact/:id', getContact); // Get Contact
router.put('/admin/contact/:id', updateContact); // Update Contact
router.get('/admin/contacts', getMeAdminContacts); // Update Contact



module.exports = router;