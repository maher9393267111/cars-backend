const User = require('../models/User');
const Categories = require('../models/CategoryBlog');

// const { singleFileDelete } = require('../config/uploader');
const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");
const getBlurDataURL = require('../config/getBlurDataURL');

const createCategory = async (req, res) => {
  try {
    const { cover, ...others } = req.body;
    // Validate if the 'blurDataURL' property exists in the logo object

    // If blurDataURL is not provided, generate it using the 'getBlurDataURL' function
   // const blurDataURL = await getBlurDataURL(cover.url);

    await Categories.create({
      ...others,
      cover: {
        ...cover,
       // blurDataURL,
      },
    });

    res.status(201).json({ success: true, message: 'Category Created' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllCategories = async (req, res) => {
  try {
    
    const categories = await Categories.find()
      .sort({
        createdAt: -1,
      })
      .select(['name', 'slug' ,'_id' ,"cover"])
    


    res.status(201).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCategoriesByAdmin = async (req, res) => {
  try {
    const categories = await Categories.find()
      .sort({
        createdAt: -1,
      })
      .select(['name', 'slug']);

    res.status(201).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCategoryByAdmin = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Categories.findOne({ slug });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category Not Found by admin',
      });
    }

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({
      success: "XXXX",
      message: error.message,
    });
  }
};
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Categories.findOne({ slug }).select([
      'name',
  
      'cover',
      'slug',
    ]);

    if (!category) {
      return res.status(400).json({
        success: "XXCCCCCVV",
        message: 'Category Not Found',
      });
    }

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({
      success: "ZZZZ",
      message: error.message,
    });
  }
};
const updateCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { ...others } = req.body;

    await Categories.findOneAndUpdate(
      { slug },
      {
        ...others,
     
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({ success: true, message: 'Category Updated' });
  } catch (error) {
    res.status(400).json({ success: "EEEEE", message: error.message });
  }
};

const deleteCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Categories.findOneAndDelete({ slug });
    //const dataaa = await singleFileDelete(category.cover._id);

    if (category && category?.cover) {
      await singleFileDelete(category?.cover?._id);
    }


    if (!category) {
      return res.status(400).json({
        success: "EEERRRRVVVVV",
        message: 'Category Not Found',
      });
    }

    res
      .status(201)
      .json({ success: true, message: 'Category Deleted Successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const getCategories = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = '' } = req.query;

    const skip = parseInt(limit) || 10;
    const totalCategories = await Categories.find({
      name: { $regex: search, $options: 'i' },
    });
    const categories = await Categories.find(
      {
        name: { $regex: search, $options: 'i' },
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    ).sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      data: categories,
      count: Math.ceil(totalCategories.length / skip),
    });
  } catch (error) {
    res.status(400).json({ success: "PAGINATION", message: error.message });
  }
};


const getCategoriesSlugs = async (req, res) => {
  try {
    const categories = await Categories.find().select('slug');

    res.status(201).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({ success: "LIST FALSE", message: error.message });
  }
};

const getCategoryNameBySlug = async (req, res) => {
  try {
    const category = await Categories.findOne({
      slug: req.params.slug,
    }).select(['name', 'slug']);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: "SLUG GET", message: error.message  });
  }
};



// getAdmin categories pagination me

const getMeAdminCategories = async (req, res) => {
  try {


    const { limit = 10, page = 1, search = "", sort = "" } = req.query;

    
    let sortOption = { createdAt: -1 }; // Default sorting by creation date, newest first

    // Trim whitespace from the sort parameter
let trimmedSort = sort.trim();

// Determine sorting logic based on the sort parameter
if (trimmedSort === "Name A-Z") {
  sortOption = { name: 1 }; // Ascending
} else if (trimmedSort === "Name Z-A") {
  sortOption = { name: -1 }; // Descending
} else if (trimmedSort === "New") {
  sortOption = { createdAt: -1 }; // Sort by creation date, newest first
} else if (trimmedSort === "Old") {
  sortOption = { createdAt: 1 }; // Sort by creation date, oldest first
} else if (trimmedSort === "orderold") {
  sortOption = { order: 1 }; // Sort by order, oldest first
} else if (trimmedSort === "ordernew") {
  sortOption = { order: -1 }; // Sort by order, newest first
} 
// Note: The default value case is handled by the initial assignment

console.log(sortOption ,sort ,trimmedSort);

    const skip = parseInt(limit) || 10;
    const totalSizes = await Categories.find({
      name: { $regex: search, $options: "i" },
     // vendor: vendor._id,
    });
    const sizes = await Categories.find(
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
      
    )
      
    
    

    res.status(201).json({
      success: true,
      data: sizes,
      count: Math.ceil(totalSizes.length / skip),
    });
  } catch (error) {
    console.log(error?.message);
    res.status(400).json({ success: "NNNOOOO", message: error.message ,err:error });
  }
};



module.exports = {
  createCategory,
  getCategories,

  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryBySlug,
  getCategoriesSlugs,

  getCategoryByAdmin,
  getCategoryNameBySlug,
  getAllCategories,
  getCategoriesByAdmin,
  getMeAdminCategories
};
