const express = require('express')

const { isAuthenticated } = require('../middleware/isAuthenticated.js')
const { singleUpload } = require('../middleware/multer.js')
const { createBlog, updateBlog, getOwnBlogs } = require('../controllers/blog.controller.js')

const router = express.Router()

// secured route for blog
router.route("/").post(isAuthenticated,createBlog)
router.route("/:blogId").put(isAuthenticated,singleUpload,updateBlog)
router.route("/get-own-blogs").get(isAuthenticated,getOwnBlogs)








module.exports = router