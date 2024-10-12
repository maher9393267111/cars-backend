// controllers/aboutController.js
const SectionOne = require("../models/sectionOne");
const {
    multiFilesDelete,
    singleFileDelete,
  } = require("../config/digitalOceanFunctions");

const createSection = async (req, res) => {
  try {
    const { ...others } = req.body;

    const newAbout = await SectionOne.create({
   ...others
    });

    res.status(201).json({ success: true, data: newAbout, message: "Section one Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSection = async (req, res) => {
  try {
    const about = await SectionOne.findOne(); // Assuming only one about entry

    if (!about) {
      return res.status(404).json({ message: "Section one Not Found" });
    }

    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSection = async (req, res) => {
  try {
    const { ...others} = req.body;
    const updatedAbout = await SectionOne.findOneAndUpdate({}, { ...others }, { new: true, runValidators: true });

    if (!updatedAbout) {
      return res.status(404).json({ message: "Section Not Found" });
    }

    res.status(200).json({ success: true, data: updatedAbout, message: "Section Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSection,
  getSection,
  updateSection,
};