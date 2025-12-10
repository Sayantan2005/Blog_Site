const { Blog } = require("../models/blog.model");
const { cloudinary } = require("../utils/cloudinary");
const { getDataUri } = require("../utils/dataUri");

// create Blog function
const createBlog = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title || !category) {
            return res.status(400).json({
                message: "Blog title and category is required"
            })
        }

        const blog = await Blog.create({
            title,
            category,
            author: req.id // from isauthenticated middleware 
        })

         // Return populated author
        blog = await Blog.findById(blog._id).populate("author", "firstName lastName photoURL");

        return res.status(201).json({
            success: true,
            blog,
            message: "Blog created Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create blog"
        })
    }
}

// update blog

const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId ///:blogId --> which i send the id in the url this is comes through the req.params.blogId --> basically we send the _id which is in the mongodb database
        const { title, subtitle, description, category } = req.body;

        const file = req.file;

        let blog = await Blog.findById(blogId)

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            })
        }

        let thumbnail;
        if (file) {
            const fileUri = getDataUri(file);
            thumbnail = await cloudinary.uploader.upload(fileUri)
        }

        // video code

        // const updateData = {title,subtitle,description,category,author:req.id, thumbnail: thumbnail?.secure_url}

        // blog = await Blog.findByIdAndUpdate(blogId,updateData,{new:true})



        // Build update-object safely
        const updateData = {};

        if (title) updateData.title = title;
        if (subtitle) updateData.subtitle = subtitle;
        if (description) updateData.description = description;
        if (category) updateData.category = category;

        // Only add thumbnail if user uploaded new image
        if (thumbnail?.secure_url) {
            updateData.thumbnail = thumbnail.secure_url;
        }

        // DO NOT change author except authenticated
        updateData.author = req.id;

        blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });

          blog = await Blog.findById(blogId).populate("author", "firstName lastName photoURL");

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error updating blog"
        })
    }
}


// After update the blog the blog sent to the your blog section and list all you blogs there

const getOwnBlogs = async (req, res) => {
    try {
        const userId = req.id
        if(!userId){
            return res.status(400).json({
                message:"User ID is required"
            })
        }

      // Find all blogs where the logged-in user is the author
const blogs = await Blog.find({ author: userId }).populate({
    
    // Tell Mongoose to replace the 'author' ObjectId with full user details
    path: "author",

    // Only return these selected fields from the User model
    // (Useful for security — prevents sending password, email, etc.)
    select: "firstName lastName photoURL"
});

if(!blogs){
    return res.status(404).json({
        message:"No blogs found",blogs:[],
        success:false
    })
}
 return res.status(200).json({
    blogs,success:true
 })

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching blogs",
            error: error.message
        })
    }
}


// delete blog controller
const deleteBlog = async(req,res) =>{
    try {
        const blogId = req.params.id // blog id comes from the url
        const authorId = req.id //authorId comes from the isAuthenticated middleware

        const blog = await Blog.findById(blogId)

        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog not found"
            })
        }
        // if the author is not there
        if(blog.author.toString() !== authorId){
            return res.status(403).json({
                success:false,
                message:"unauthorized to delete this blog"
            })
        }
        // delete blog
        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({
            success:true,
            message:"Blog deleted successfully"
        })
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error deleting blog",
        error:error.message
      })  
    }
}


module.exports = {
    createBlog,
    updateBlog,
    getOwnBlogs,
    deleteBlog
}



