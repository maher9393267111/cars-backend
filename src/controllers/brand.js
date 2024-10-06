const Brands = require('../models/Brand');
const getBlurDataURL = require('../config/getBlurDataURL');
// const { singleFileDelete } = require('../config/uploader');
const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");
const Brand = require('../models/Brand');

const createBrand = async (req, res) => {
  try {
    const { logo, ...others } = req.body;

    // Validate if the 'logo' property and its 'url' property exist in the request body
    if (!logo || !logo.url) {
      return res.status(400).json({ message: 'Invalid Logo Data' });
    }

    // Validate if the 'blurDataURL' property exists in the logo object

    // If blurDataURL is not provided, generate it using the 'getBlurDataURL' function
   // const blurDataURL = await getBlurDataURL(logo.url);

    // Creating a new brand
    const newBrand = await Brands.create({
      ...others,
      logo: {
        ...logo,
     //   blurDataURL,
      },
      totalItems: 0,
    });

    res
      .status(201)
      .json({ success: true, data: newBrand, message: 'Brand Created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brands.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await Brands.findOne({ slug });

    if (!brand) {
      return res.status(404).json({ message: 'Brand Not Found' });
    }

    res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { ...others } = req.body;
    // Validate if the 'blurDataURL' property exists in the logo object

    const updatedBrand = await Brands.findOneAndUpdate(
      { slug },
      {
        ...others,
   
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand Not Found' });
    }

    res
      .status(201)
      .json({ success: true, data: updatedBrand, message: 'Brand Updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await Brands.findOne({ slug });

    if (!brand) {
      return res.status(404).json({ message: 'Brand Not Found' });
    }
    // Uncomment the line below if you have a function to delete the logo file
 //   const dataaa = await singleFileDelete(brand?.logo?._id);

 if (brand && brand?.logo) {
  await singleFileDelete(brand?.logo?._id);
}


    await Brands.deleteOne({ slug });

    res.status(201).json({ success: true, message: 'Brand Deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Brands.find().sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// get admin brands pagination
const getAdminBrands = async (req, res) => {
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
    const totalSizes = await Brand.find({
      name: { $regex: search, $options: "i" },
     // vendor: vendor._id,
    });
    const sizes = await Brand.find(
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


module.exports = {
  createBrand,
  getAllBrands,
  getBrandBySlug,
  updateBrandBySlug,
  deleteBrandBySlug,
  getBrands,
  getAdminBrands
};
