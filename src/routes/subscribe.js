const express = require("express");
const {
  createCheckoutSession,
  updateSubscription,
  cancelSubscription,
  createSubscribePlan,
  updateSubscribePlanBySlug,
  deleteSubscribePlanBySlug,
  getAllSubscribePlan,
  getSubscribePlanBySlug
  
} = require("../controllers/subscribe");
// Import verifyToken function
const verifyToken = require("../config/jwt");
const router = express.Router();

// Define the POST route for creating a checkout session
router.post("/vendor/checkout", createCheckoutSession);
router.post("/vendor/subscribe", updateSubscription);
router.get("/vendor/cancelsubscribe", verifyToken, cancelSubscription);

//Admin crud

router.post("/admin/subscribeplan", verifyToken, createSubscribePlan);
router.get("/admin/subscribeplans", verifyToken, getAllSubscribePlan);
router.get("/admin/subscribeplan/:slug", verifyToken,getSubscribePlanBySlug );

router.put("/admin/subscribeplan/:slug", verifyToken, updateSubscribePlanBySlug);
router.delete("/admin/subscribeplan/:slug", verifyToken, deleteSubscribePlanBySlug);

module.exports = router;
