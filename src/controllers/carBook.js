const User = require("../models/User");
const Features = require("../models/carBook");
const Car = require("../models/car");
const Notifications = require("../models/Notification");



const createFeature = async (req, res) => {
  try {
    const { ...others } = req.body;

  const carbook =  await Features.create({
      ...others,
    });


    // Fetch car details
    const car = await Car.findById(others.car);

    // Create a notification
    await Notifications.create({
      opened: false,
      title: "New Test Drive Booking",
      userDetails: `${others.fullname} - ${others.email}`,
      // link:`${carbook?.slug}`,
      date: others.date,
      cover: {
        _id: car._id.toString(),
        url: car.images[0]?.url || "default_car_image_url"
      },
      // city: others.city || "Unknown",
      city:`${carbook?._id}`,

      carDetails: `${car?.name}`
    });




    res
      .status(201)
      .json({ success: true, message: "Your car booked Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



const getFeatureByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const feature = await Features.findOne({ _id:id }).populate({ path: 'car', select: ['name', 'slug' ,'code'] });;

    if (!feature) {
      return res.status(400).json({
        success: false,
        message: "Feature Not Found by admin",
      });
    }
    console.log("feature" , feature)

    res.status(201).json({ success: true, data: feature });
  } catch (error) {
    res.status(400).json({
      success: "XXXX",
      message: error.message,
    });
  }
};

const updateFeatureBySlug = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...others } = req.body;

    await Features.findOneAndUpdate(
      { _id:id },
      {
        ...others,
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({ success: true, message: "Feature Updated" });
  } catch (error) {
    res.status(400).json({ success: "EEEEE", message: error.message });
  }
};

const deleteFeatureBySlug = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await Features.findOneAndDelete({ _id:id });

    if (!feature) {
      return res.status(400).json({
        success: "EEERRRRVVVVV",
        message: "Feature Not Found",
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Feature Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMeAdminFeatures = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = "", sort = "" } = req.query;

    let sortOption = { createdAt: -1 }; // Default sorting by creation date, newest first

    let trimmedSort = sort.trim();

    if (trimmedSort === "Name A-Z") {
      sortOption = { name: 1 };
    } else if (trimmedSort === "Name Z-A") {
      sortOption = { name: -1 };
    } else if (trimmedSort === "New") {
      sortOption = { createdAt: -1 };
    } else if (trimmedSort === "Old") {
      sortOption = { createdAt: 1 };
    } else if (trimmedSort === "orderold") {
      sortOption = { order: 1 };
    } else if (trimmedSort === "ordernew") {
      sortOption = { order: -1 };
    }

    const skip = parseInt(limit) || 10;
    const totalFeatures = await Features.find({
      fullname: { $regex: search, $options: "i" },
    });
    const features = await Features.find(
      {
        fullname: { $regex: search, $options: "i" },
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    ).sort(sortOption);

    console.log("Car booked", features);

    res.status(201).json({
      success: true,
      data: features,
      count: Math.ceil(totalFeatures.length / skip),
    });
  } catch (error) {
    console.log(error?.message);
    res
      .status(400)
      .json({ success: "NNNOOOO", message: error.message, err: error });
  }
};





module.exports = {
  createFeature,

  updateFeatureBySlug,
  deleteFeatureBySlug,
  
  getFeatureByAdmin,



  getMeAdminFeatures,
};
