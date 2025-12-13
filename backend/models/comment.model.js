const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content:{
      type:String,
      required:true,
    },
    // blog ki id
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:{
        type:Array,
        default:[]
    },
    numberOfLikes:{
        type:Number,
        default:0
    },
}
,{timestamps:true})

const Comment = mongoose.model("Comment",commentSchema)
module.exports = {
    Comment
}