const express = require("express");
const router = express.Router();
const dependence = require("../controllers/dependence");

// Import verifyToken function
const verifyToken = require("../config/jwt");

// vendor routes

router.post("/admin/dependence", verifyToken, dependence.createDependence);

router.get("/admin/dependences", verifyToken, dependence.getAllDependence);

router.get("/admin/dependence/:slug", verifyToken, dependence.getDependenceBySlug);

router.put("/admin/dependence/:slug", verifyToken, dependence.updateDependenceBySlug);

router.delete("/admin/dependence/:slug", verifyToken,  dependence.deleteDependenceBySlug);


 router.get("/admin/dependencenopagination",  dependence.getAllDependenceWithoutPagination);




module.exports = router;
