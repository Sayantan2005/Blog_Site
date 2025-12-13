const { Blog } = require("../models/blog.model")
const { Comment } = require("../models/comment.model")

// create Comment
const createComment = async (req, res) => {
    try {
        const postId = req.params.id
        const commentKrnewaleuserKiId = req.id
        const { content } = req.body

        const blog = await Blog.findById(postId)
        if (!content) return res.status(400).json({
            message: "Text is required",
            success: false
        })

        const comment = await Comment.create({
            content, 
            userId: commentKrnewaleuserKiId,
            postId: postId
        })

        await comment.populate({
            path:"userId",
            select: "firstName , lastName , photoURl"
        })

        // comment ki id particular blog main push karo
        blog.comments.push(comment._id)
        await blog.save()
        return res.status(201).json({
            message:"Comment Added",
            comment,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

// get comments of post
const getCommentofPost = async(req,res)=>{
    try {
        const blogId = req.params.id
        const comments = await Comment.find({postId:blogId}).populate({
            path:"userId",
            select:"firstName,lastName,photoURL"
        }).sort({createdAt: -1})

        if(!comments) return res.status(404).json({
            message:"No comments found for this blog",
            success:false
        })
        return res.status(200).json({
            success:true,
            comments
        })
    } catch (error) {
        console.log(error);
        
    }
}

// delete comment
const deleteComment = async (req,res) => {
try {
    const commentId = req.params.id
    const authorId = req.id
    const comment = await Comment.findById(commentId)
    if(!comment){
        return res.status(404).json({
            success:false,
            message:"Comment not found"
        })
    }

    if(comment.userId.toString() !== authorId){
        return res.status(403).json({
            success:false,
            message:"Unauthorized to delete this comment"
        })
    }

    const blogId = comment.postId;
    // delete the comment
    await Comment.findByIdAndDelete(commentId);
    // remove comment id from blogs comments array
    await Blog.findByIdAndUpdate(
        blogId,
        {
            $pull: {comments:commentId}
        }
    )

    res.status(200).json({
        success:true,
        message:"Comment deleted successfully"
    })
} catch (error) {
    res.status(500).json({success:false,message:"Error deleting comment",error:error.message})
}
}

const editComment = async (req,res)=>{
   try {
    const userId = req.id
    const {content} = req.body
    const commentId = req.params.id

    const comment = await Comment.findById(commentId)
    if(!comment){
        return res.status(404).json({
            message:"Comment Not Found"
        })
    }
    // check if the user owns the comment
    if(comment.userId.toString() !== userId){
        return res.status(403).json({
            success:false,
            message:"Not authorized to edit this comment"
        })
    }

    comment.content = content
    comment.editedAt = new Date();
    await comment.save()
    res.status(200).json({
        success:true,
        message:"Comment update succussfully",
        comment
    })
   } catch (error) {
    console.log(error)
    res.status(500).json({
        success:false,
        message:"Comment is not edited", error:error.message
    })
   } 
}

const likeComment = async(req,res)=>{
    try {
       const userId = req.id
       const commentId = req.params.id
       const comment = await Comment.findById(commentId).populate("userId")

       if(!comment){
        return res.status(404).json({
            success:false,
            message:"Comment not found"
        })
       }  

       const alreadyLiked = comment.likes.includes(userId)

       if(alreadyLiked){
        //if already liked, then unlike it
        comment.likes = comment.likes.filter(id => id !== userId)
        comment.numberOfLikes -= 1
       }else{
        //if not like yet , then like it 
        comment.likes.push(userId)
        comment.numberofLikes += 1;
       }

       await comment.save()
       res.status(200).json({
        success:true,
        message:alreadyLiked ? "Comment unliked" : "Comment liked",
        updatedComment: comment
       })
    } catch (error) {
           console.log(error)
    res.status(500).json({
        success:false,
        message:"Something went wrong when liking this comment", error:error.message
    })
    }
}

// get all comments from all my blog
const getAllCommentOnMyBlogs = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    createComment,
    getCommentofPost,
    deleteComment,
    editComment,
    likeComment
}