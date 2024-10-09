// controllers/aboutController.js
const About = require("../models/about");

const createAbout = async (req, res) => {
  try {
    const { title,description ,logo ,content } = req.body;

    const newAbout = await About.create({
      title,
      description,
      logo,
      content,
    });

    res.status(201).json({ success: true, data: newAbout, message: "About Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne(); // Assuming only one about entry

    if (!about) {
      return res.status(404).json({ message: "About Not Found" });
    }

    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    const { title, description, logo  , content} = req.body;
    const updatedAbout = await About.findOneAndUpdate({}, { title, description, logo , content }, { new: true, runValidators: true });

    if (!updatedAbout) {
      return res.status(404).json({ message: "About Not Found" });
    }

    res.status(200).json({ success: true, data: updatedAbout, message: "About Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAbout,
  getAbout,
  updateAbout,
};