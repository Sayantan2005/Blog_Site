const express = require('express')

const { isAuthenticated } = require('../middleware/isAuthenticated.js')
const { singleUpload } = require('../middleware/multer.js')
const { createBlog, updateBlog, getOwnBlogs, deleteBlog, likeBlog, dislikeBlog, getMyTotalBlogLikes, getPublishedBlog, togglePublishBlog } = require('../controllers/blog.controller.js')

const router = express.Router()

// secured route for blog
router.route("/").post(isAuthenticated,createBlog)
router.route("/:blogId").put(isAuthenticated,singleUpload,updateBlog)
router.route("/get-own-blogs").get(isAuthenticated,getOwnBlogs)
router.route("/delete/:id").delete(isAuthenticated,deleteBlog)

router.route("/:id/like").get(isAuthenticated,likeBlog)
router.route("/:id/dislike").get(isAuthenticated,dislikeBlog)

router.route("/my-blogs/likes").get(isAuthenticated,getMyTotalBlogLikes)

router.route("/get-published-blogs").get(isAuthenticated,getPublishedBlog)

router.route("/:blogId").patch(isAuthenticated,togglePublishBlog) //update blog has the same path but the method is different









module.exports = router