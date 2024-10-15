// controllers/services.js

const Services = require('../models/service');

const createService = async (req, res) => {
  try {
    const { services } = req.body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "At least one service is required" });
    }

    const newServices = await Services.create({ services });

    res.status(201).json({ success: true, data: newServices, message: "Services Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Services.findOne();

    if (!services) {
      return res.status(404).json({ message: "Services Not Found" });
    }

    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const updateServices = async (req, res) => {
  try {
    const { services } = req.body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "At least one service is required" });
    }

    const existingServices = await Services.findOne();

    if (!existingServices) {
      return res.status(404).json({ message: "Services Not Found" });
    }

    const updatedServices = await Services.findOneAndUpdate(
      {},
      { services },
      { new: true, runValidators: true }
    );

    if (!updatedServices) {
      return res.status(404).json({ message: "Failed to update services" });
    }

    res.status(200).json({ success: true, data: updatedServices, message: "Services Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const services = await Services.findOne();

    if (!services) {
      return res.status(404).json({ message: "Services Not Found" });
    }

    const serviceToDelete = services.services.id(serviceId);

    if (!serviceToDelete) {
      return res.status(404).json({ message: "Service Not Found" });
    }

    // Remove the service from the array
    services.services = services.services.filter(service => service._id.toString() !== serviceId);

    await services.save();

    res.status(200).json({ success: true, message: "Service Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

module.exports = {
  createService,
  getServices,
  updateServices,
  deleteService,
};