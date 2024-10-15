// controllers/sectionThree.js

const SectionThree = require('../models/sectionThree');
const { multiFilesDelete, singleFileDelete } = require('../config/digitalOceanFunctions');

const createSection = async (req, res) => {
  try {
    const { sections } = req.body;

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ success: false, message: "At least one section is required" });
    }

    const newSections = await SectionThree.create({ sections });

    res.status(201).json({ success: true, data: newSections, message: "Sections Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const getSection = async (req, res) => {
  try {
    const sections = await SectionThree.findOne();

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

    const existingSections = await SectionThree.findOne();

    if (!existingSections) {
      return res.status(404).json({ message: "Sections Not Found" });
    }

    // Find sections to delete
    const sectionsToDelete = existingSections.sections.filter(
      existingSection => !sections.some(newSection => newSection._id && newSection._id.toString() === existingSection._id.toString())
    );

    // Delete images for removed sections
// Delete images for removed sections
const imagesToDelete = sectionsToDelete
.map(section => section.logo)
.filter(logo => logo && logo._id);

if (imagesToDelete.length > 0) {
try {
  await Promise.all(imagesToDelete.map(logo => singleFileDelete(logo._id)));
  console.log('Deleted images:', imagesToDelete.map(logo => logo._id));
} catch (deleteError) {
  console.error('Error deleting images:', deleteError);
  // Consider whether you want to stop the update process if image deletion fails
  // or if you want to continue with the update and just log the error
}
}


    const updatedSections = await SectionThree.findOneAndUpdate(
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

    const sections = await SectionThree.findOne();

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




const updateOrder = async (req, res) => {
    try {
      const { newOrder } = req.body;
  
      if (!newOrder || !Array.isArray(newOrder) || newOrder.length === 0) {
        return res.status(400).json({ success: false, message: "New order array is required" });
      }
  
      const sections = await SectionThree.findOne();
  
      if (!sections) {
        return res.status(404).json({ message: "Sections Not Found" });
      }
  
      sections.reorderSections(newOrder);
      await sections.save();
  
      res.status(200).json({ success: true, data: sections, message: "Sections order updated" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
    }
  };
  




module.exports = {
  createSection,
  getSection,
  updateSection,
  deleteSection,
  updateOrder
};