const User = require('../models/User');
const Features = require('../models/feature');

const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");
const getBlurDataURL = require('../config/getBlurDataURL');

const createFeature = async (req, res) => {
  try {
    const {  ...others } = req.body;

    await Features.create({
      ...others,
     
    });

    res.status(201).json({ success: true, message: 'Feature Created' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllFeatures = async (req, res) => {
  try {
    const features = await Features.find()
      .sort({ createdAt: -1 })
      

    res.status(201).json({
      success: true,
      data: features,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFeaturesByAdmin = async (req, res) => {
  try {
    const features = await Features.find()
      .sort({ createdAt: -1 })
      ;

    res.status(201).json({
      success: true,
      data: features,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFeatureByAdmin = async (req, res) => {
  try {
    const { slug } = req.params;
    const feature = await Features.findOne({ slug });

    if (!feature) {
      return res.status(400).json({
        success: false,
        message: 'Feature Not Found by admin',
      });
    }

    res.status(201).json({ success: true, data: feature });
  } catch (error) {
    res.status(400).json({
      success: "XXXX",
      message: error.message,
    });
  }
};

const getFeatureBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const feature = await Features.findOne({ slug });

    if (!feature) {
      return res.status(400).json({
        success: "XXCCCCCVV",
        message: 'Feature Not Found',
      });
    }

    res.status(201).json({ success: true, data: feature });
  } catch (error) {
    res.status(400).json({
      success: "ZZZZ",
      message: error.message,
    });
  }
};

const updateFeatureBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { ...others } = req.body;

    await Features.findOneAndUpdate(
      { slug },
      {
        ...others,
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({ success: true, message: 'Feature Updated' });
  } catch (error) {
    res.status(400).json({ success: "EEEEE", message: error.message });
  }
};

const deleteFeatureBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const feature = await Features.findOneAndDelete({ slug });


    if (!feature) {
      return res.status(400).json({
        success: "EEERRRRVVVVV",
        message: 'Feature Not Found',
      });
    }

    res.status(201).json({ success: true, message: 'Feature Deleted Successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFeatures = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = '' } = req.query;

    const skip = parseInt(limit) || 10;
    const totalFeatures = await Features.find({
      name: { $regex: search, $options: 'i' },
    });
    const features = await Features.find(
      {
        name: { $regex: search, $options: 'i' },
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    ).sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      data: features,
      count: Math.ceil(totalFeatures.length / skip),
    });
  } catch (error) {
    res.status(400).json({ success: "PAGINATION", message: error.message });
  }
};

const getFeaturesSlugs = async (req, res) => {
  try {
    const features = await Features.find().select('slug');

    res.status(201).json({
      success: true,
      data: features,
    });
  } catch (error) {
    res.status(400).json({ success: "LIST FALSE", message: error.message });
  }
};

const getFeatureNameBySlug = async (req, res) => {
  try {
    const feature = await Features.findOne({
      slug: req.params.slug,
    }).select(['name', 'slug']);

    res.status(201).json({
      success: true,
      data: feature,
    });
  } catch (error) {
    res.status(400).json({ success: "SLUG GET", message: error.message });
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
      name: { $regex: search, $options: "i" },
    });
    const features = await Features.find(
      {
        title: { $regex: search, $options: "i" },
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    ).sort(sortOption);


    console.log("FEATURes" ,features)
    
    res.status(201).json({
      success: true,
      data: features,
      count: Math.ceil(totalFeatures.length / skip),
    });
  } catch (error) {
    console.log(error?.message);
    res.status(400).json({ success: "NNNOOOO", message: error.message, err: error });
  }
};

module.exports = {
  createFeature,
  getFeatures,
  getFeatureBySlug,
  updateFeatureBySlug,
  deleteFeatureBySlug,
  getFeaturesSlugs,
  getFeatureByAdmin,
  getFeatureNameBySlug,
  getAllFeatures,
  getFeaturesByAdmin,
  getMeAdminFeatures
};