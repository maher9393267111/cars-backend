const MultiSections = require('../models/sectionOne');
const { multiFilesDelete, singleFileDelete } = require('../config/digitalOceanFunctions');

const createSection = async (req, res) => {
  try {
    const { sections } = req.body;

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ success: false, message: "At least one section is required" });
    }

    const newSections = await MultiSections.create({ sections });

    res.status(201).json({ success: true, data: newSections, message: "Sections Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const getSection = async (req, res) => {
  try {
    const sections = await MultiSections.findOne();

    if (!sections) {
      return res.status(404).json({ message: "Sections Not Found" });
    }

    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const updateSection = async (req, res) => {
  try {
    const { sections } = req.body;

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ success: false, message: "At least one section is required" });
    }

    const existingSections = await MultiSections.findOne();

    if (!existingSections) {
      return res.status(404).json({ message: "Sections Not Found" });
    }

    // Find sections to delete
    const sectionsToDelete = existingSections.sections.filter(
      existingSection => !sections.some(newSection => newSection._id && newSection._id.toString() === existingSection._id.toString())
    );

    // Delete images for removed sections
    const imagesToDelete = sectionsToDelete
      .map(section => section.logo && section.logo._id)
      .filter(id => id);

    if (imagesToDelete.length > 0) {
      await multiFilesDelete(imagesToDelete);
    }

    const updatedSections = await MultiSections.findOneAndUpdate(
      {},
      { sections },
      { new: true, runValidators: true }
    );

    if (!updatedSections) {
      return res.status(404).json({ message: "Failed to update sections" });
    }

    res.status(200).json({ success: true, data: updatedSections, message: "Sections Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const sections = await MultiSections.findOne();

    if (!sections) {
      return res.status(404).json({ message: "Sections Not Found" });
    }

    const sectionToDelete = sections.sections.id(sectionId);

    if (!sectionToDelete) {
      return res.status(404).json({ message: "Section Not Found" });
    }

    // Delete the image associated with the section
    if (sectionToDelete.logo && sectionToDelete.logo._id) {
      await singleFileDelete(sectionToDelete.logo._id);
    }

    // Remove the section from the array
    sections.sections = sections.sections.filter(section => section._id.toString() !== sectionId);

    await sections.save();

    res.status(200).json({ success: true, message: "Section Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

module.exports = {
  createSection,
  getSection,
  updateSection,
  deleteSection,
};






// const SectionOne = require("../models/sectionOne");
// const {
//     multiFilesDelete,
//     singleFileDelete,
//   } = require("../config/digitalOceanFunctions");

// const createSection = async (req, res) => {
//   try {
//     const { ...others } = req.body;

//     const newAbout = await SectionOne.create({
//    ...others
//     });

//     res.status(201).json({ success: true, data: newAbout, message: "Section one Created" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getSection = async (req, res) => {
//   try {
//     const about = await SectionOne.findOne(); // Assuming only one about entry

//     if (!about) {
//       return res.status(404).json({ message: "Section one Not Found" });
//     }

//     res.status(200).json({ success: true, data: about });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updateSection = async (req, res) => {
//   try {
//     const { ...others} = req.body;
//     const updatedAbout = await SectionOne.findOneAndUpdate({}, { ...others }, { new: true, runValidators: true });

//     if (!updatedAbout) {
//       return res.status(404).json({ message: "Section Not Found" });
//     }

//     res.status(200).json({ success: true, data: updatedAbout, message: "Section Updated" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   createSection,
//   getSection,
//   updateSection,
// };