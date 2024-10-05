const express = require("express");
const router = express.Router();
const boiler = require("../controllers/boiler");

// Import verifyToken function
const verifyToken = require("../config/jwt");

// vendor routes

router.post("/admin/productboiler", verifyToken, boiler.createBoiler);

router.get("/admin/productboilers", verifyToken, boiler.getAllBoilers);

router.get("/admin/productboiler/:slug", verifyToken, boiler.getBoilerBySlug);

router.put("/admin/productboiler/:slug", verifyToken, boiler.updateBoilerBySlug);

router.delete("/admin/productboiler/:slug", verifyToken,  boiler.deleteBoilerBySlug);

//all admi or vendors boilers o pagination

router.get("/admin/productboilersnopagination", verifyToken, boiler.getAllBoilersWithoutPagination);


module.exports = router;
