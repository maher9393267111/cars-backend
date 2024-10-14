const Section = require("../models/sectionTwo");

const createSection = async (req, res) => {
  try {
    const { title, subtitle, items } = req.body;

    const newSection = await Section.create({
      title,
      subtitle,
      items,
    });

    res.status(201).json({ success: true, data: newSection, message: "Section Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSection = async (req, res) => {
  try {
    const section = await Section.findOne(); // Assuming only one section entry

    if (!section) {
      return res.status(404).json({ message: "Section Not Found" });
    }

    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSection = async (req, res) => {
  try {
    const { title, subtitle, items } = req.body;
    const updatedSection = await Section.findOneAndUpdate(
      {},
      { title, subtitle, items },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({ message: "Section Not Found" });
    }

    res.status(200).json({ success: true, data: updatedSection, message: "Section Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find();

    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSection,
  getSection,
  updateSection,
  getAllSections,
};