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


// 



module.exports = {
    createBlog,
    updateBlog
}