const SiteReviews = require("../models/siteReview");
const getBlurDataURL = require("../config/getBlurDataURL");
// const { singleFileDelete } = require('../config/uploader');
const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");

const createSiteReview = async (req, res) => {
  try {
    const { ...others } = req.body;

    // Creating a new SiteReview
    const newSiteReview = await SiteReviews.create({
      ...others,
    });

    res
      .status(201)
      .json({
        success: true,
        data: newSiteReview,
        message: "SiteReview Created",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllViews = async (req, res) => {
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
      const totalSizes = await SiteReviews.find({
        name: { $regex: search, $options: "i" },
       // vendor: vendor._id,
      });
      const sizes = await SiteReviews.find(
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
      )
        
      
        console.log("cars-->" , sizes)
  
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


const getSiteReviewBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const siteReview = await SiteReviews.findOne({ slug });

    if (!siteReview) {
      return res.status(404).json({ message: "SiteReview Not Found" });
    }

    res.status(201).json({
      success: true,
      data: siteReview,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSiteReviewBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { ...others } = req.body;

    const updatedSiteReview = await SiteReviews.findOneAndUpdate(
      { slug },
      {
        ...others,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSiteReview) {
      return res.status(404).json({ message: "SiteReview Not Found" });
    }

    res
      .status(201)
      .json({
        success: true,
        data: updatedSiteReview,
        message: "SiteReview Updated",
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSiteReviewBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const SiteReview = await SiteReviews.findOne({ slug });

    if (!SiteReview) {
      return res.status(404).json({ message: "SiteReview Not Found" });
    }
    // Uncomment the line below if you have a function to delete the logo file
    //   const dataaa = await singleFileDelete(SiteReview?.logo?._id);

    if (SiteReview && SiteReview?.cover) {
      await singleFileDelete(SiteReview?.cover?._id);
    }

    await SiteReviews.deleteOne({ slug });

    res.status(201).json({ success: true, message: "SiteReview Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSiteReviews = async (req, res) => {
  try {
    const SiteReviews = await SiteReviews.find().sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      data: SiteReviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSiteReview,
  getAllViews,
  getSiteReviewBySlug,
  updateSiteReviewBySlug,
  deleteSiteReviewBySlug,
  getSiteReviews,
};
