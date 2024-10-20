const express = require('express');
const router = express.Router();
const { createCarSlider, getCarSlider, updateCarSlider, getAllCarSliders } = require('../controllers/carSlider');

router.post('/admin/carslider', createCarSlider); // Create Car Slider
router.get('/admin/carslider', getCarSlider); // Get Single Car Slider
router.get('/admin/carsliders', getAllCarSliders); // Get All Car Sliders
router.put('/admin/carslider', updateCarSlider); // Update Car Slider




module.exports = router;


