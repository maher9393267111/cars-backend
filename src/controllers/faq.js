const User = require('../models/User');
const FAQs = require('../models/faq');

const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");
const getBlurDataURL = require('../config/getBlurDataURL');

const createFaq = async (req, res) => {
  try {
    const {  ...others } = req.body;

    await FAQs.create({
      ...others,
   
    });

    res.status(201).json({ success: true, message: 'FAQ Created' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllFaqs = async (req, res) => {
  try {
    const faqs = await FAQs.find()
      .sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFaqsByAdmin = async (req, res) => {
  try {
    const faqs = await FAQs.find()
      .sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFaqByAdmin = async (req, res) => {
  try {
    const { slug } = req.params;
    const faq = await FAQs.findOne({ slug });

    if (!faq) {
      return res.status(400).json({
        success: false,
        message: 'FAQ Not Found by admin',
      });
    }

    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({
      success: "XXXX",
      message: error.message,
    });
  }
};

const getFaqBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const faq = await FAQs.findOne({ slug }).select(['name', 'cover', 'slug']);

    if (!faq) {
      return res.status(400).json({
        success: "XXCCCCCVV",
        message: 'FAQ Not Found',
      });
    }

    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({
      success: "ZZZZ",
      message: error.message,
    });
  }
};

const updateFaqBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { ...others } = req.body;

    await FAQs.findOneAndUpdate(
      { slug },
      {
        ...others,
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({ success: true, message: 'FAQ Updated' });
  } catch (error) {
    res.status(400).json({ success: "EEEEE", message: error.message });
  }
};

const deleteFaqBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const faq = await FAQs.findOneAndDelete({ slug });

 

    if (!faq) {
      return res.status(400).json({
        success: "EEERRRRVVVVV",
        message: 'FAQ Not Found',
      });
    }

    res.status(201).json({ success: true, message: 'FAQ Deleted Successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFaqs = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = '' } = req.query;

    const skip = parseInt(limit) || 10;
    const totalFaqs = await FAQs.find({
      name: { $regex: search, $options: 'i' },
    });
    const faqs = await FAQs.find(
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
      data: faqs,
      count: Math.ceil(totalFaqs.length / skip),
    });
  } catch (error) {
    res.status(400).json({ success: "PAGINATION", message: error.message });
  }
};

const getFaqsSlugs = async (req, res) => {
  try {
    const faqs = await FAQs.find().select('slug');

    res.status(201).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(400).json({ success: "LIST FALSE", message: error.message });
  }
};

const getFaqNameBySlug = async (req, res) => {
  try {
    const faq = await FAQs.findOne({
      slug: req.params.slug,
    }).select(['name', 'slug']);

    res.status(201).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    res.status(400).json({ success: "SLUG GET", message: error.message });
  }
};

const getMeAdminFaqs = async (req, res) => {
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
    const totalFaqs = await FAQs.find({
      question: { $regex: search, $options: "i" },
    });
    const faqs = await FAQs.find(
      {
        question: { $regex: search, $options: "i" },
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    ).sort(sortOption);
    
    res.status(201).json({
      success: true,
      data: faqs,
      count: Math.ceil(totalFaqs.length / skip),
    });
  } catch (error) {
    console.log(error?.message);
    res.status(400).json({ success: "NNNOOOO", message: error.message, err: error });
  }
};

module.exports = {
  createFaq,
  getFaqs,
  getFaqBySlug,
  updateFaqBySlug,
  deleteFaqBySlug,
  getFaqsSlugs,
  getFaqByAdmin,
  getFaqNameBySlug,
  getAllFaqs,
  getFaqsByAdmin,
  getMeAdminFaqs
};