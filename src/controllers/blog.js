const Blogs = require("../models/blog");
const Category = require("../models/CategoryBlog");
const getBlurDataURL = require("../config/getBlurDataURL");

const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");
const Blog = require("../models/blog");


const createBlog = async (req, res) => {
  try {
    const {  ...others } = req.body;



    // Creating a new Blog
    const newBlog = await Blogs.create({
      ...others,
    
      
    });

    res
      .status(201)
      .json({ success: true, data: newBlog, message: "Blog Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find().sort({
      createdAt: -1,
    }).populate("category");
    res.status(201).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blogs.findOne({ slug }).populate("category");

    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { ...others } = req.body;
    // Validate if the 'blurDataURL' property exists in the logo object

    const updatedBlog = await Blogs.findOneAndUpdate(
      { slug },
      {
        ...others,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }

    res
      .status(201)
      .json({ success: true, data: updatedBlog, message: "Blog Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blogs.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }
    // Uncomment the line below if you have a function to delete the logo file
    //   const dataaa = await singleFileDelete(Blog?.logo?._id);

    if (blog && blog?.logo) {
      await singleFileDelete(blog?.logo?._id);
    }

    await Blogs.deleteOne({ slug });

    res.status(201).json({ success: true, message: "Blog Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find().sort({
      createdAt: -1,
    }).populate("category");

    res.status(201).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get admin Blogs pagination
const getBlogsPagination = async (req, res) => {
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
    const totalSizes = await Blogs.find({
      name: { $regex: search, $options: "i" },
      // vendor: vendor._id,
    });
    const sizes = await Blogs.find(
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
    ).populate("category");

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




const getFiltersByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch category data
    const categoryData = await Category.findOne({ slug: category }).select([
      "_id",
      "name",
    ]);
    if (!categoryData) {
      return res
        .status(404)
        .json({ success: false, message: "Category Not Found" });
    }

    // Fetch cars for the category under the specified shop
    const cars = await Car.find({
      // status: { $ne: 'disabled' },
      category: categoryData._id,
    }).select(["brand"]); // Only select brand

    // Extract unique brands
    const brands = [...new Set(cars.map((car) => car.brand))].filter(Boolean); // Clean brands
    console.log("brands-->", brands);

    // Construct the response object for category and brands
    const response = {
      category: categoryData, // Include category details
      brands,
    };

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFilters = async (req, res) => {
  try {
    // Fetch categories (assuming you have a Category model)
    const categories = await Category.find({
      // status: { $ne: "disabled" },
    }).select(["name", "slug"]); // Adjust the fields according to your Category schema


//get tags from blogs tags is array of strings in blog schema
    const tags = await Blogs.find().distinct("tags");


    // Construct the response object for brands and categories
    const response = {
    
      categories,
      tags,
    
    };

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getBlogsFilter = async (req, res) => {
  try {
    const query = req.query; // Extract query params from request

    // Create a new query object for filtering
    const newQuery = {
      tags: query.tags ? query.tags.split("_") : undefined,
      categoryId: query.category 
    };

    // Remove pagination related parameters from the query
    const limit = Number(query.limit) || 10; // Default limit if not provided
    const page = Number(query.page) || 1; // Default to page 1 if not provided
    const skip = limit * (page - 1); // Calculate the skip value

    // Prepare the query for fetching blogs
    const totalBlogs = await Blog.countDocuments({
      ...(newQuery.tags && { tags: { $in: newQuery.tags } }),
      ...(newQuery.categoryId && { category:newQuery.categoryId }),
    });

    const blogs = await Blog.find({
      ...(newQuery.tags && { tags: { $in: newQuery.tags } }),
      ...(newQuery.categoryId && { category: newQuery.categoryId }),
    })
      .skip(skip)
      .limit(limit)
      .populate("category") // Assuming you want to populate category details
      

    res.status(200).json({
      success: true,
      data: blogs,
      total: totalBlogs,
      count: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



module.exports = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlogBySlug,
  deleteBlogBySlug,
  getBlogs,
  getBlogsPagination,
  //frontend
  getBlogsFilter,
getFilters
};
