const express = require('express')

const { isAuthenticated } = require('../middleware/isAuthenticated.js')

const { createComment, deleteComment, editComment, getCommentsofPost, likeComment, getAllCommentOnMyBlogs } = require('../controllers/comment.controller.js')

const router = express.Router()

// secured route ---> authenticated user can create comment , delete comment , edit comment,get comments of a post , like or dislike comments , 
router.post("/:id/create",isAuthenticated,createComment)
router.delete('/:id/delete',isAuthenticated,deleteComment)
router.put("/:id/edit",isAuthenticated,editComment)
router.route("/:id/comment/all").get(getCommentsofPost)

router.get("/:id/like",isAuthenticated,likeComment)
router.get("/my-blogs/comments" , isAuthenticated,getAllCommentOnMyBlogs)


module.exports = router