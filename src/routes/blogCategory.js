const express = require('express');
const router = express.Router();
const categories = require('../controllers/blogCategory');

// Import verifyToken function
const verifyToken = require('../config/jwt');

router.post('/admin/blogcategories', verifyToken, categories.createCategory);

router.get('/admin/blogcategories', verifyToken, categories.getCategories);

router.get(
  '/admin/blogcategories/:slug',
  verifyToken,
  categories.getCategoryBySlug
);

router.put(
  '/admin/blogcategories/:slug',
  verifyToken,
  categories.updateCategoryBySlug
);
router.delete(
  '/admin/blogcategories/:slug',
  verifyToken,
  categories.deleteCategoryBySlug
);
router.get('/admin/blogcategories/all', verifyToken, categories.getCategories);
router.get('/admin/all-blogcategories', categories.getCategoriesByAdmin);

// User routes

router.get('/blogcategories', categories.getCategories);

router.get('/all-blogcategories', categories.getAllCategories);
router.get('/blogcategories-slugs', categories.getCategoriesSlugs);

router.get('/blogcategories/:slug', categories.getCategoryBySlug);
router.get('/blogcategory-title/:slug', categories.getCategoryNameBySlug);


//me  categories in admin dashboard with pagination and search sort
router.get('/admin/blogcategories-me/all', categories.getMeAdminCategories);



module.exports = router;
