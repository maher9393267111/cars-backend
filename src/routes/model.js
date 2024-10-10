const express = require("express");
const router = express.Router();
const Model = require("../controllers/model");

// Import verifyToken function
const verifyToken = require("../config/jwt");

// admin routes

//me pagination Models in admin dashboard

router.get("/admin/models-all", Model.getAdminModels);



router.post("/admin/models", verifyToken, Model.createModel);

router.get("/admin/models", Model.getModels);

router.get("/admin/models/:slug", verifyToken, Model.getModelBySlug);

router.put("/admin/models/:slug", verifyToken, Model.updateModelBySlug);

router.delete("/admin/models/:slug", verifyToken, Model.deleteModelBySlug);

router.get("/admin/all-models", Model.getAllModels);

// User routes

router.get("/models", Model.getAllModels);

module.exports = router;
