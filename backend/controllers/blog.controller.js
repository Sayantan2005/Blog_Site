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

// get all published blogs in the Blogs section
const getPublishedBlog = async(_ ,res) =>{
    try {
        const blogs = await Blog.find({isPublished:true}).sort({createdAt: -1}).populate({
            path:"author",
            select:"firstName,lastName , photoURL"
        })

        if(!blogs){
            return res.status(401).json({
                message:"Blogs not found"
            })
        }

        return res.status(200).json({
            success:true,
            blogs
        })
    } catch (error) {
        return res.status(500).json({
            message:"Failed to get published blogs"
        })
    }
}

// toggle the publish button 
// Toggle the publish status of a blog (publish <-> unpublish)
const togglePublishBlog = async (req, res) => {
    try {
        const { blogId } = req.params;              // Get blog ID from the URL
        const { publish } = req.query;              // Optional query param (?publish=true)

        // Find the blog by ID
        const blog = await Blog.findById(blogId);

        // If blog doesn't exist → return 404
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Toggle the publish status (if true → false, if false → true)
        blog.isPublished = !blog.isPublished;

        // Save updated blog to database
        await blog.save();

        // Prepare a readable message for the frontend
        const statusMessage = blog.isPublished ? "Published" : "Unpublished";

        // Send response back to the client
        return res.status(200).json({
            success: true,
            message: `Blog is ${statusMessage}`
        });

    } catch (error) {
        // Handle any server error
        return res.status(500).json({
            message: "Failed to update blog"
        });
    }
};

// like blog controller
// Controller to like a blog
const likeBlog = async (req, res) => {
    try {
        // Extract the blog ID from route parameters (URL: /:id/like)
        const blogId = req.params.id;

        // The ID of the user who is liking the blog (set by authentication middleware)
        const likeKrneWaleUserkiId = req.id;

        // Find the blog and populate the 'likes' array to see who liked it
        const blog = await Blog.findById(blogId).populate({
            path: "likes"
        });

        // If the blog doesn't exist, return a 404 response
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                success: false
            });
        }

        // like logic started
        // Add the user ID to the 'likes' array
        // $addToSet ensures the user can LIKE only once (no duplicate IDs)
        await blog.updateOne({
            $addToSet: { likes: likeKrneWaleUserkiId }
        });

        // Save the updated data to the database
        await blog.save();

        // Return a success response
        return res.status(200).json({
            message: "Blog liked",
            blog,
            success: true
        });

    } catch (error) {
        // Log the error and return 500 response
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};

// dislike blog

const dislikeBlog = async (req,res) => {
    try {
      
        const blogId = req.params.id;


        const likeKrneWaleUserkiId = req.id;

      
        const blog = await Blog.findById(blogId)

        // If the blog doesn't exist, return a 404 response
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                success: false
            });
        }

    //    dislike logic started
        await blog.updateOne({
            $pull: { likes: likeKrneWaleUserkiId }
        });
        await blog.save();
        return res.status(200).json({
            message: "Blog disliked",
            blog,
            success: true
        });
    } catch (error) {
       console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        }); 
    }
}

// Get total number of blogs, total likes, and comments of the logged-in user

const getMyTotalBlogLikes = async (req, res) => {
    try {
        // The logged-in user's ID comes from middleware (auth middleware)
        const userId = req.id;

        // Find all blogs created by this user
        // Only select the 'likes' field because we only need likes count
        const myBlogs = await Blog.find({ author: userId }).select("likes");

        /* 
        Use reduce() to calculate total likes.
        - acc = accumulator (stores total likes)
        - blog = current blog
        - blog.likes?.length = number of likes on this blog (optional chaining used)
        - If likes is undefined, use 0
        */
        const totallikes = myBlogs.reduce(
            (acc, blog) => acc + (blog.likes?.length || 0),
            0 // initial value of accumulator
        );

        // Response sending total blogs and total likes
        return res.status(200).json({
            success: true,
            totalBlogs: myBlogs.length, // total blogs written by user
            totallikes                // total likes on all blogs
        });
    } catch (error) {
        // If any error occurs while fetching data
        return res.status(500).json({
            success: false,
            message: "Failed to fetch total blog likes"
        });
    }
}





module.exports = {
    createBlog,
    updateBlog,
    getOwnBlogs,
    deleteBlog,
    getPublishedBlog,
    togglePublishBlog,
    likeBlog,
    dislikeBlog,
    getMyTotalBlogLikes
}



