const express = require('express');
const router = express.Router();
const features = require('../controllers/feature');

// Import verifyToken function
const verifyToken = require('../config/jwt');

router.post('/admin/features', verifyToken, features.createFeature);

router.get('/admin/features', verifyToken, features.getFeatures);

router.get(
  '/admin/features/:slug',
  verifyToken,
  features.getFeatureBySlug
);

router.put(
  '/admin/features/:slug',
  verifyToken,
  features.updateFeatureBySlug
);
router.delete(
  '/admin/features/:slug',
  verifyToken,
  features.deleteFeatureBySlug
);
router.get('/admin/features/all', verifyToken, features.getFeatures);
router.get('/admin/all-features', features.getFeaturesByAdmin);

// User routes

router.get('/features', features.getFeatures);

router.get('/all-features', features.getAllFeatures);


router.get('/features/:slug', features.getFeatureBySlug);


// Me features in admin dashboard with pagination and search sort
router.get('/admin/features-me/all', features.getMeAdminFeatures);

module.exports = router;