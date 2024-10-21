const NavTitles = require('../models/navTitles');

const createNavTitles = async (req, res) => {
  try {
    const { ...otherFields } = req.body;

    if (!otherFields?.items || !Array.isArray(otherFields?.items) || otherFields?.items?.length === 0) {
      return res.status(400).json({ success: false, message: "At least one item is required" });
    }

    const newNavTitles = await NavTitles.create(otherFields);

    res.status(201).json({ success: true, data: newNavTitles, message: "Nav Titles Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const getNavTitles = async (req, res) => {
  try {
    const navTitles = await NavTitles.findOne();

// create default nav titles if not found
if (!navTitles) {
  await NavTitles.create({ items: [ {title: "Home", icon: "home"} ] });
}

    res.status(200).json({ success: true, data: navTitles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const updateNavTitles = async (req, res) => {
  try {
    const { ...otherFields } = req.body;

    if (!otherFields?.items || !Array.isArray(otherFields?.items) || otherFields?.items?.length === 0) {
      return res.status(400).json({ success: false, message: "At least one item is required" });
    }

    const existingNavTitles = await NavTitles.findOne();

    if (!existingNavTitles) {
      return res.status(404).json({ message: "Nav Titles Not Found" });
    }

    const updatedNavTitles = await NavTitles.findOneAndUpdate(
      {},
      otherFields,
      { new: true, runValidators: true }
    );

    if (!updatedNavTitles) {
      return res.status(404).json({ message: "Failed to update nav titles" });
    }

    res.status(200).json({ success: true, data: updatedNavTitles, message: "Nav Titles Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const deleteNavTitle = async (req, res) => {
  try {
    const { itemId } = req.params;

    const navTitles = await NavTitles.findOne();

    if (!navTitles) {
      return res.status(404).json({ message: "Nav Titles Not Found" });
    }

    const itemToDelete = navTitles.items.id(itemId);

    if (!itemToDelete) {
      return res.status(404).json({ message: "Item Not Found" });
    }

    // Remove the item from the array
    navTitles.items = navTitles.items.filter(item => item._id.toString() !== itemId);

    await navTitles.save();

    res.status(200).json({ success: true, message: "Nav Title Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

module.exports = {
  createNavTitles,
  getNavTitles,
  updateNavTitles,
  deleteNavTitle,
};