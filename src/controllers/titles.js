const Titles = require('../models/sectionTitles');

const createTitles = async (req, res) => {
    try {
      const { ...others } = req.body;

      const newTitles = await Titles.create({
        ...others,
      });

      res.status(201).json({ success: true, data: newTitles, message: 'Titles Created' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const getTitles = async (req, res) => {
    try {
      const titles = await Titles.findOne();
  
      if (!titles) {
        return res.status(404).json({ message: 'Titles Not Found' });
      }
  
      res.status(200).json({ success: true, data: titles });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const updateTitles = async (req, res) => {
    try {
      const { ...others } = req.body;
      const updatedTitles = await Titles.findOneAndUpdate(
        {},
        { ...others },
        { new: true, runValidators: true }
      );
  
      if (!updatedTitles) {
        return res.status(404).json({ message: 'Titles Not Found' });
      }
  
      res.status(200).json({ success: true, data: updatedTitles, message: 'Titles Updated' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const deleteTitles = async (req, res) => {
    try {
      const { titleId } = req.params;
  
      const titles = await Titles.findOne();
  
      if (!titles) {
        return res.status(404).json({ message: 'Titles Not Found' });
      }
  
      await singleFileDelete(titles.logo._id);
  
      await Titles.deleteOne({ titleId });
  
      res.status(201).json({ success: true, message: 'Titles Deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  module.exports = {
    createTitles,
    getTitles,
    updateTitles,
    deleteTitles,
  };