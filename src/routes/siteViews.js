const express = require("express");
const router = express.Router();
const siteReview = require("../controllers/siteReview");

// Import verifyToken function
const verifyToken = require("../config/jwt");
const SiteReview = require("../models/siteReview");


// vendor routes

router.post("/admin/siteview", siteReview.createSiteReview);

router.get("/admin/siteviews",  siteReview.getAllViews);

router.get("/admin/siteview/:slug", siteReview.getSiteReviewBySlug);

router.put("/admin/siteview/:slug", siteReview.updateSiteReviewBySlug);

router.delete("/admin/siteview/:slug",  siteReview.deleteSiteReviewBySlug);


 router.get("/front/siteviewsnopagination", siteReview.getFrontReviews);


module.exports = router;
