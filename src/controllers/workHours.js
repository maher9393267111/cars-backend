const WorkHours = require("../models/workHours");

const createWorkHours = async (req, res) => {
  try {
    const newWorkHours = await WorkHours.create(req.body);
    res.status(201).json({ success: true, data: newWorkHours, message: "Work Hours Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWorkHours = async (req, res) => {
  try {
    const workHours = await WorkHours.findOne();
    if (!workHours) {
      return res.status(404).json({ message: "Work Hours Not Found" });
    }
    res.status(200).json({ success: true, data: workHours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateWorkHours = async (req, res) => {
  try {
    const updatedWorkHours = await WorkHours.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!updatedWorkHours) {
      return res.status(404).json({ message: "Work Hours Not Found" });
    }
    res.status(200).json({ success: true, data: updatedWorkHours, message: "Work Hours Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createWorkHours,
  getWorkHours,
  updateWorkHours,
};