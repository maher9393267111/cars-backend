// controllers/aboutController.js
const About = require("../models/banner");

const createBanner = async (req, res) => {
  try {
    const { title,description ,logo ,logomobile, bgColor, textColor} = req.body;

    const newAbout = await About.create({
      title,
      description,
      logo,
      logomobile,
      bgColor,
      textColor
      
    });

    res.status(201).json({ success: true, data: newAbout, message: "Banner Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBanner = async (req, res) => {
  try {
    const about = await About.findOne(); // Assuming only one about entry

    if (!about) {
      return res.status(404).json({ message: "Banner Not Found" });
    }

    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { title, description, logo  ,logomobile, bgColor, textColor} = req.body;
    const updatedAbout = await About.findOneAndUpdate({}, { title, description, logo , logomobile, bgColor, textColor }, { new: true, runValidators: true });

    if (!updatedAbout) {
      return res.status(404).json({ message: "Banner Not Found" });
    }

    res.status(200).json({ success: true, data: updatedAbout, message: "Banner Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBanner,
  getBanner,
  updateBanner,
};