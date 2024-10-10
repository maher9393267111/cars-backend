const Models = require("../models/model");
const getBlurDataURL = require("../config/getBlurDataURL");
// const { singleFileDelete } = require('../config/uploader');
const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");


const createModel = async (req, res) => {
  try {
    const {...others } = req.body;



    const newModel = await Models.create({
      ...others,
  
    });

    res
      .status(201)
      .json({ success: true, data: newModel, message: "Model Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllModels = async (req, res) => {
  try {
    const models = await Models.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      data: models,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getModelBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const Model = await Models.findOne({ slug });

    if (!Model) {
      return res.status(404).json({ message: "Model Not Found" });
    }

    res.status(201).json({
      success: true,
      data: Model,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateModelBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { ...others } = req.body;
    // Validate if the 'blurDataURL' property exists in the logo object

    const updatedModel = await Models.findOneAndUpdate(
      { slug },
      {
        ...others,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedModel) {
      return res.status(404).json({ message: "Model Not Found" });
    }

    res
      .status(201)
      .json({ success: true, data: updatedModel, message: "Model Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteModelBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const Model = await Models.findOne({ slug });

    if (!Model) {
      return res.status(404).json({ message: "Model Not Found" });
    }
    // Uncomment the line below if you have a function to delete the logo file
    //   const dataaa = await singleFileDelete(Model?.logo?._id);

    if (Model && Model?.logo) {
      await singleFileDelete(Model?.logo?._id);
    }

    await Models.deleteOne({ slug });

    res.status(201).json({ success: true, message: "Model Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getModels = async (req, res) => {
  try {
    const models = await Models.find().sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      data: models,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get admin Models pagination
const getAdminModels = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = "", sort = "" } = req.query;

    let sortOption = {};

    // Determine sorting logic based on the sort parameter
    if (sort === "Name A-Z") {
      sortOption = { name: 1 }; // Ascending
    } else if (sort === "Name Z-A") {
      sortOption = { name: -1 }; // Descending
    } else if (sort === "New") {
      sortOption = { createdAt: -1 }; // Sort by creation date, newest first
    } else if (sort === "Old") {
      sortOption = { createdAt: 1 }; // Sort by creation date, oldest first
    } else if (sort === "orderold") {
      sortOption = { order: 1 }; // Sort by creation date, oldest first
    } else if (sort === "ordernew") {
      sortOption = { order: -1 }; // Sort by creation date, oldest first
    } else if (sort === "") {
      sortOption = { createdAt: -1 }; // Sort by creation date, oldest first
    }

    const skip = parseInt(limit) || 10;
    const totalSizes = await Models.find({
      name: { $regex: search, $options: "i" },
      // vendor: vendor._id,
    });
    const sizes = await Models.find(
      {
        name: { $regex: search, $options: "i" },
        // vendor: vendor._id,
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    ).sort(
      sortOption
      //  {  createdAt: -1, }
    ).populate("brand");;

    console.log("cars-->", sizes);

    res.status(201).json({
      success: true,
      data: sizes,
      count: Math.ceil(totalSizes.length / skip),
    });
  } catch (error) {
    console.log(error?.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createModel,
  getAllModels,
  getModelBySlug,
  updateModelBySlug,
  deleteModelBySlug,
  getModels,
  getAdminModels,
};
