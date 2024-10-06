const express = require("express");
const router = express.Router();
const blog = require("../controllers/blog");

// Import verifyToken function
const verifyToken = require("../config/jwt");

// admin routes  change brands to blogs 



router.post("/admin/blog", verifyToken, blog.createBlog);

router.get("/admin/blogs", verifyToken, blog.getBlogs);

router.get("/admin/blog/:slug", blog.getBlogBySlug);

router.put("/admin/blog/:slug", verifyToken, blog.updateBlogBySlug);

router.delete("/admin/blog/:slug", verifyToken, blog.deleteBlogBySlug);

// router.get("/admin/all-blogs", blog.getAllBlogs);

// User routes

router.get("/admin/blogs-all", blog.getBlogsPagination);


module.exports = router;
