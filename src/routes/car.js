const express = require("express");
const router = express.Router();
const Car = require("../controllers/car");

// Import verifyToken function
const verifyToken = require("../config/jwt");


// vendor routes

router.post("/admin/car", verifyToken, Car.createCar);

router.get("/admin/cars", verifyToken,  Car.getAllCars);

router.get("/admin/car/:slug", Car.getCarBySlug);

router.put("/admin/car/:slug", verifyToken, Car.updateCarBySlug);

router.delete("/admin/car/:slug", verifyToken,  Car.deleteCarBySlug);


router.get("/admin/carsnopagination", Car.getAllCarsWithoutPagination);
router.get("/admin/cars-home", Car.getHomepageCars);



router.get('/cars/category/:category', Car.getFiltersByCategory);

//filter cars in frontend
router.get('/cars', Car.getCarsFilter);
router.get('/cars/filter', Car.getFilters);


router.get('/admin/cars-anlaytics', Car.getDashboardAnalytics);







module.exports = router;
