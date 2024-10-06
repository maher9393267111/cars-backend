const express = require("express");
const router = express.Router();
const siteReview = require("../controllers/siteReview");

// Import verifyToken function
const verifyToken = require("../config/jwt");


// vendor routes

router.post("/admin/siteview", siteReview.createSiteReview);

router.get("/admin/siteviews",  siteReview.getAllViews);

router.get("/admin/siteview/:slug", siteReview.getSiteReviewBySlug);

router.put("/admin/siteview/:slug", siteReview.updateSiteReviewBySlug);

router.delete("/admin/siteview/:slug",  siteReview.deleteSiteReviewBySlug);


// router.get("/admin/siteviewnopagination", Car.getAllCarsWithoutPagination);


module.exports = router;
