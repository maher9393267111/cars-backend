const express = require("express");
const router = express.Router();
const Car = require("../controllers/car");

// Import verifyToken function
const verifyToken = require("../config/jwt");


// vendor routes

router.post("/admin/car", verifyToken, Car.createCar);

router.get("/admin/cars", verifyToken,  Car.getAllCars);

router.get("/admin/car/:slug", verifyToken, Car.getCarBySlug);

router.put("/admin/car/:slug", verifyToken, Car.updateCarBySlug);

router.delete("/admin/car/:slug", verifyToken,  Car.deleteCarBySlug);


router.get("/admin/carsnopagination", verifyToken, Car.getAllCarsWithoutPagination);


module.exports = router;