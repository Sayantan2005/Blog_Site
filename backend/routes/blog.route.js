const express = require('express')

const { isAuthenticated } = require('../middleware/isAuthenticated.js')
const { singleUpload } = require('../middleware/multer.js')
const { createBlog, updateBlog } = require('../controllers/blog.controller.js')

const router = express.Router()

// secured route for blog
router.route("/").post(isAuthenticated,createBlog)
router.route("/:blogId").put(isAuthenticated,singleUpload,updateBlog)





module.exports = router