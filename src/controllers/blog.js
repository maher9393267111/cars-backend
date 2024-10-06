const Blogs = require("../models/blog");
const getBlurDataURL = require("../config/getBlurDataURL");

const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");


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
    });
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
    const blog = await Blogs.findOne({ slug });

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
    });

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
    );

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
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlogBySlug,
  deleteBlogBySlug,
  getBlogs,
  getBlogsPagination,
};
