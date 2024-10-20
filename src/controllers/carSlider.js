const CarSlider = require("../models/carsSlider");

const createCarSlider = async (req, res) => {
  try {
    const { items } = req.body;

    const newCarSlider = await CarSlider.create({
      items,
    });

    res.status(201).json({ success: true, data: newCarSlider, message: "Car Slider Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCarSlider = async (req, res) => {
  try {
    const carSlider = await CarSlider.findOne(); // Assuming only one car slider entry

    if (!carSlider) {
      return res.status(404).json({ message: "Car Slider Not Found" });
    }

    res.status(200).json({ success: true, data: carSlider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCarSlider = async (req, res) => {
  try {
    const { items } = req.body;
    const updatedCarSlider = await CarSlider.findOneAndUpdate(
      {},
      { items },
      { new: true, runValidators: true }
    );

    if (!updatedCarSlider) {
      return res.status(404).json({ message: "Car Slider Not Found" });
    }

    res.status(200).json({ success: true, data: updatedCarSlider, message: "Car Slider Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCarSliders = async (req, res) => {
  try {
    const carSliders = await CarSlider.find();

  //send array empty if no car sliders
  
 
    res.status(200).json({ success: true, data: carSliders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const deleteCarSlider = async (req, res) => {

  // try {
//i have onlly one car slider so i cant delete it
    // const carSlider = await CarSlider.findOneAndDelete();

    // if (!carSlider) {
    //   return res.status(404).json({ message: "Car Slider Not Found" });
    // }

    // res.status(200).json({ success: true, data: carSlider, message: "Car Slider Deleted" });
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error.message });
  // }
  
// };




module.exports = {
  createCarSlider,
  getCarSlider,
  updateCarSlider,
  getAllCarSliders,
};

