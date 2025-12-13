// Import Blog and Comment Mongoose models
const { Blog } = require("../models/blog.model")
const { Comment } = require("../models/comment.model")

/* =====================================================
   CREATE A COMMENT ON A BLOG POST
===================================================== */
const createComment = async (req, res) => {
    try {
        // Blog ID coming from URL → /comment/:id
        const postId = req.params.id

        // Logged-in user's ID (added by auth middleware)
        const commentKrnewaleuserKiId = req.id

        // Comment text from request body
        const { content } = req.body

        // Find the blog on which the comment is added
        const blog = await Blog.findById(postId)

        // Validation: comment content must exist
        if (!content) return res.status(400).json({
            message: "Text is required",
            success: false
        })

        // Create comment document
        // Only ObjectIds are stored here (userId & postId)
        const comment = await Comment.create({
            content,
            userId: commentKrnewaleuserKiId, // reference to User collection
            postId: postId                  // reference to Blog collection
        })

        /* -------------------------------------------------
           POPULATE userId
           - Takes userId ObjectId from comment
           - Finds matching document in User collection
           - Replaces ObjectId with selected user fields
        -------------------------------------------------- */
        await comment.populate({
            path: "userId", // field name in Comment schema
            select: "firstName lastName photoURL" // fields to return
        })

        // Push comment ID into blog's comments array
        blog.comments.push(comment._id)

        // Save updated blog document
        await blog.save()

        // Send success response
        return res.status(201).json({
            message: "Comment Added",
            comment,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

/* =====================================================
   GET ALL COMMENTS OF A SPECIFIC BLOG POST
===================================================== */
const getCommentsofPost = async (req, res) => {
    try {
        // Blog ID from route params
        const blogId = req.params.id

        // Find comments related to this blog
        const comments = await Comment.find({ postId: blogId })

            /* ---------------------------------------------
               POPULATE userId for each comment
               Allows frontend to show commenter details
            ---------------------------------------------- */
            .populate({
                path: "userId",
                select: "firstName lastName photoURL"
            })

            // Latest comments appear first
            .sort({ createdAt: -1 })

        // If no comments exist
        if (!comments) return res.status(404).json({
            message: "No comments found for this blog",
            success: false
        })

        return res.status(200).json({
            success: true,
            comments
        })
    } catch (error) {
        console.log(error)
    }
}

/* =====================================================
   DELETE A COMMENT
===================================================== */
const deleteComment = async (req, res) => {
    try {
        // Comment ID from route params
        const commentId = req.params.id

        // Logged-in user ID
        const authorId = req.id

        // Find the comment document
        const comment = await Comment.findById(commentId)

        // If comment does not exist
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }

        // Authorization check: only owner can delete
        if (comment.userId.toString() !== authorId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this comment"
            })
        }

        // Get related blog ID
        const blogId = comment.postId

        // Delete comment from Comment collection
        await Comment.findByIdAndDelete(commentId)

        // Remove comment ID from blog's comments array
        await Blog.findByIdAndUpdate(
            blogId,
            { $pull: { comments: commentId } }
        )

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting comment",
            error: error.message
        })
    }
}

/* =====================================================
   EDIT A COMMENT
===================================================== */
const editComment = async (req, res) => {
    try {
        // Logged-in user ID
        const userId = req.id

        // Updated content
        const { content } = req.body

        // Comment ID from params
        const commentId = req.params.id

        // Find comment
        const comment = await Comment.findById(commentId)

        // If comment does not exist
        if (!comment) {
            return res.status(404).json({
                message: "Comment Not Found"
            })
        }

        // Authorization check
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to edit this comment"
            })
        }

        // Update comment content
        comment.content = content

        // Track edit time
        comment.editedAt = new Date()

        // Save updated comment
        await comment.save()

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Comment is not edited",
            error: error.message
        })
    }
}

/* =====================================================
   LIKE / UNLIKE A COMMENT
===================================================== */
const likeComment = async (req, res) => {
    try {
        // Logged-in user ID
        const userId = req.id

        // Comment ID from params
        const commentId = req.params.id

        // Find comment document
        const comment = await Comment.findById(commentId)

        // If comment not found
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }

        // Check if user already liked the comment
        const alreadyLiked = comment.likes.includes(userId)

        if (alreadyLiked) {
            // Unlike the comment
            comment.likes = comment.likes.filter(id => id !== userId)
            comment.numberOfLikes -= 1
        } else {
            // Like the comment
            comment.likes.push(userId)
            comment.numberOfLikes += 1
        }

        // Save updated comment
        await comment.save()

        res.status(200).json({
            success: true,
            message: alreadyLiked ? "Comment unliked" : "Comment liked",
            updatedComment: comment
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong when liking this comment",
            error: error.message
        })
    }
}

/* =====================================================
   GET ALL COMMENTS ON ALL BLOGS CREATED BY LOGGED-IN USER
===================================================== */
const getAllCommentOnMyBlogs = async (req, res) => {
    try {
        // Logged-in user's ID
        const userId = req.id

        // Find blogs created by the user
        const myBlogs = await Blog.find({ author: userId }).select("_id")

        // Extract blog IDs
        const blogIds = myBlogs.map(blog => blog._id)

        // If user has no blogs
        if (blogIds.length === 0) {
            return res.status(200).json({
                success: true,
                totalComments: 0,
                comments: [],
                message: "No blogs found for this user"
            })
        }

        // Find comments belonging to user's blogs
        const comments = await Comment.find({
            postId: { $in: blogIds }
        })

            /* ---------------------------------------------
               MULTIPLE POPULATE
               1. userId → commenter details
               2. postId → blog title
            ---------------------------------------------- */
            .populate("userId", "firstName lastName email")
            .populate("postId", "title")

        res.status(200).json({
            success: true,
            totalComments: comments.length,
            comments
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to get comments"
        })
    }
}

/* =====================================================
   EXPORT CONTROLLERS
===================================================== */
module.exports = {
    createComment,
    getCommentsofPost,
    deleteComment,
    editComment,
    likeComment,
    getAllCommentOnMyBlogs
}
