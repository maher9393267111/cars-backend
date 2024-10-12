const express = require("express");
const router = express.Router();
const features = require("../controllers/carBook");

// Import verifyToken function
const verifyToken = require("../config/jwt");

router.post("/admin/car-book", verifyToken, features.createFeature);

router.get("/admin/car-book/:id", verifyToken, features.getFeatureByAdmin);

router.put("/admin/car-book/:id", verifyToken, features.updateFeatureBySlug);
router.delete(
  "/admin/car-book/:id",
  verifyToken,
  features.deleteFeatureBySlug
);

// User routes

// Me features in admin dashboard with pagination and search sort
router.get("/admin/car-book-all", features.getMeAdminFeatures);

module.exports = router;
