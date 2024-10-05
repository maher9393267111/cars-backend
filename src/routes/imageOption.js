const express = require("express");
const router = express.Router();
const imageoption = require("../controllers/imageOption");

// Import verifyToken function
const verifyToken = require("../config/jwt");
const { getAllBoilersTypeWithoutPagination } = require("../controllers/boilertype");

// vendor routes

router.post("/admin/imageoption", verifyToken, imageoption.createImageOption);

router.get("/admin/imageoptions", verifyToken,  imageoption.getAllImageOption);

router.get("/admin/imageoption/:slug", verifyToken, imageoption.getImageOptionBySlug);

router.put("/admin/imageoption/:slug", verifyToken, imageoption.updateImageOptionBySlug);

router.delete("/admin/imageoption/:slug", verifyToken,  imageoption.deleteImageOptionBySlug);


router.get("/admin/imageoptionsnopagination", verifyToken, imageoption.getAllImageOptionsWithoutPagination);


module.exports = router;
