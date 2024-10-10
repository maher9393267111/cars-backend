const Contact = require("../models/contact");

const createContact = async (req, res) => {
  try {
    const { ...others } = req.body;

    const newContact = await Contact.create({
  ...others
    });

    res.status(201).json({ success: true, data: newContact, message: "Contact Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne(); // Assuming only one contact entry

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact Not Found" });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const {...others } = req.body;
    const updatedContact = await Contact.findOneAndUpdate({}, { ...others }, { new: true, runValidators: true });

    if (!updatedContact) {
      return res.status(404).json({ success: false, message: "Contact Not Found" });
    }

    res.status(200).json({ success: true, data: updatedContact, message: "Contact Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createContact,
  getContact,
  updateContact,
};