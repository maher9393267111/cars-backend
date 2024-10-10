const express = require('express');
const router = express.Router();
const faqs = require('../controllers/faq'); // Adjusted for FAQs

// Import verifyToken function
const verifyToken = require('../config/jwt');

// Admin routes
router.post('/admin/faqs', verifyToken, faqs.createFaq);

router.get('/admin/faqs', verifyToken, faqs.getFaqs);

router.get(
  '/admin/faqs/:slug',
  verifyToken,
  faqs.getFaqBySlug
);

router.put(
  '/admin/faqs/:slug',
  verifyToken,
  faqs.updateFaqBySlug
);

router.delete(
  '/admin/faqs/:slug',
  verifyToken,
  faqs.deleteFaqBySlug
);

router.get('/admin/faqs/all', verifyToken, faqs.getFaqs);
router.get('/admin/all-faqs', faqs.getFaqsByAdmin);

// User routes
router.get('/faqs', faqs.getFaqs);

router.get('/all-faqs', faqs.getAllFaqs);

router.get('/faqs/:slug', faqs.getFaqBySlug);

// Me FAQs in admin dashboard with pagination and search sort
router.get('/admin/faqs-me/all', faqs.getMeAdminFaqs);

module.exports = router;