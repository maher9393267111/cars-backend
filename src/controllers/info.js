// controllers/aboutController.js
const About = require("../models/info");

const createInfo = async (req, res) => {
  try {
    const { ...othres } = req.body;

    const newAbout = await About.create({
        ...othres,
    });

    res.status(201).json({ success: true, data: newAbout, message: "About Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInfo = async (req, res) => {
  try {
    const about = await About.findOne(); // Assuming only one about entry

    if (!about) {
      return res.status(404).json({ message: "Info data Not Found" });
    }

    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInfo = async (req, res) => {
  try {
    const { ...othres} = req.body;
    const updatedAbout = await About.findOneAndUpdate({}, { 
       ...othres,
     }, { new: true, runValidators: true });

    if (!updatedAbout) {
      return res.status(404).json({ message: "Info Not Found" });
    }

    res.status(200).json({ success: true, data: updatedAbout, message: "Info data Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInfo,
  getInfo,
  updateInfo,
};