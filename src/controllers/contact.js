

const Contact = require("../models/contact");
const Notifications = require('../models/Notification')

const createContact = async (req, res) => {
  try {
    const { ...others } = req.body;

    const newContact = await Contact.create({
  ...others
    });


      // Create a notification
      const currentDate = new Date()
      await Notifications.create({
        opened: false,
        title: "New Contact message",
        userDetails: `${others.firstName} - ${others.email}`,
      
        date: currentDate,
        cover: {
          _id: newContact._id.toString(),
          url: "default_car_image_url"
        },
      
        city:`${newContact?._id}`,
  
        carDetails: `${newContact?.firstName}`
      });
  



    res.status(201).json({ success: true, data: newContact, message: "Contact Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne({ _id: id });

    if (!contact) {
      return res.status(400).json({
        success: false,
        message: "Contact Not Found by admin",
      });
    }

    console.log("contact", contact);

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...others } = req.body;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id },
      {
        ...others,
      },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(400).json({
        success: false,
        message: "Contact Not Found",
      });
    }

    res.status(201).json({ success: true, message: "Contact Updated" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



getMeAdminContacts = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = "", sort = "" } = req.query;

    let sortOption = { createdAt: -1 }; // Default sorting by creation date, newest first

    let trimmedSort = sort.trim();

    if (trimmedSort === "Email A-Z") {
      sortOption = { email: 1 };
    } else if (trimmedSort === "Email Z-A") {
      sortOption = { email: -1 };
    } else if (trimmedSort === "New") {
      sortOption = { createdAt: -1 };
    } else if (trimmedSort === "Old") {
      sortOption = { createdAt: 1 };
    }

    const skip = parseInt(limit) || 10;
    const totalContacts = await Contact.countDocuments({
      $or: [
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ]
    });

    const contacts = await Contact.find(
      {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } }
        ]
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    ).sort(sortOption);

    console.log("Contacts fetched", contacts);

    res.status(200).json({
      success: true,
      data: contacts,
      count: Math.ceil(totalContacts / skip),
    });
  } catch (error) {
    console.log(error?.message);
    res
      .status(400)
      .json({ success: false, message: error.message, err: error });
  }
};



module.exports = {
  createContact,
  getContact,
  updateContact,
  getMeAdminContacts
};