import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

function BlogCard({blog}) {

// format date
const date = new Date(blog.createdAt)
const formattedDate = date.toLocaleDateString("en-GB")
const navigate = useNavigate()

  return (
    <div className='bg-white dark:bg-gray-800 dark:border-gray-600 p-5 rounded-2xl shadow-lg border hover:scale-105 transition-all'>
        <img src={blog.thumbnail}  className="rounded-lg w-full h-64 object-cover" />
        <p className='text-sm mt-2 '>
            By {blog.author.firstName} || {blog.category} || {formattedDate}
        </p>
        <h2 className='text-xl font-semibold'>{blog.title}</h2>
        <h3 className='text-gray-500 mt-1'>{blog.subtitle}</h3>
        <Button onClick={()=>navigate(`/blogs/${blog._id}`)} className="mt-4 px-4 py-2 rounded-lg text-sm">
            Read More
        </Button>
    </div>
  )
}

export default BlogCard