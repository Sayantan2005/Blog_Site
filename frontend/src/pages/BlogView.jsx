import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Bookmark, MessageSquare, Share2, User } from 'lucide-react'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'
import CommentBox from '@/components/CommentBox'


function BlogView() {

    const dispatch = useDispatch()
    const params = useParams()
    const blogId = params.blogId
    const { blogs } = useSelector(store => store.blog)
    const {user} = useSelector(store => store.auth)
    const selectedBlog = blogs.find(blog => blog._id === blogId)
    console.log(selectedBlog)

    const [blogLike, setBlogLike] = useState(selectedBlog.likes.length)



    // Initialize a state named "liked"
    // It checks if the logged-in user's ID exists inside the blog's "likes" array
    // selectedBlog.likes.includes(User._id) → returns true if the user already liked the blog
    // If selectedBlog.likes is undefined, it will fallback to false
    const [liked, setLiked] = useState(selectedBlog.likes.includes(user._id) || false);


    const changeTimeFormat = (isDate) => {
        const date = new Date(isDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = date.toLocaleDateString('en-GB', options)
        return formattedDate
    }

    // function for sharing
    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`
        if (navigator.share) {
            navigator.share({
                title: 'Check out this blog!',
                text: "Read this amazing blog post",
                url: blogUrl,
            }).then(() => console.log('shared successfully')).catch((error) => console.error("Error Sharing")
            )

        } else {
            // fall back copy to clipboard
            navigator.clipboard.writeText(blogUrl).then(() => {
                toast.success('Blog Link copied to clipboard')
            })
        }
    }

    // This function handles LIKE and DISLIKE actions for a specific blog
    const likeOrDislikeHandler = async () => {
        try {
            // If the blog is already liked → action = "dislike"
            // Otherwise → action = "like"
            const action = liked ? "dislike" : "like";

            // Send a request to backend to like or dislike the blog
            const res = await axios.get(
                `https://blog-site-2-pzsc.onrender.com/blog/${selectedBlog._id}/${action}`,
                { withCredentials: true }
            );

            // If backend responds success
            if (res.data.success) {
                // Update the like count on UI immediately
                // If already liked → decrease, else increase
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
                setBlogLike(updatedLikes);

                // Toggle the "liked" state (true → false, false → true)
                setLiked(!liked);
            }
            // apne blog ko update karunga 
            // Create a new list of blogs in Redux
            // We update ONLY the blog that was liked/disliked
            const updatedBlogData = blogs.map((p) =>
                // Check if this blog is the one the user clicked
                p._id === selectedBlog._id
                    ? {
                        ...p, // keep all other blog properties unchanged

                        // Update the "likes" array
                        likes: liked
                            // If user already liked → remove their ID using filter()
                            ? p.likes.filter((id) => id !== user._id)

                            // If user is liking now → add their ID to the array
                            : [...p.likes, user._id]
                    }
                    : p // If this is not the selected blog → return it unchanged
            );

            // Show success message from backend ("Liked", "Disliked", etc.)
            toast.success(res.data.message);

            // Update Redux store so UI everywhere updates instantly
            dispatch(setBlog(updatedBlogData));

        } catch (error) {
            // Log error for debugging
            console.log(error);

            // Show error message from backend
            toast.error(error.response?.data?.message);
        }
    };
 useEffect(() => {
  // Scroll the window to the top (x = 0, y = 0)
  // This runs when the component is loaded (mounted)
  // Useful when navigating between pages so the new page
  // always starts from the top
  window.scrollTo(0, 0)
}, []) // Empty dependency array means it runs only once

    return (
        <div className='pt-14'>
            <div className='max-w-6xl mx-auto p-10'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/docs/components">Blogs</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* blog header */}
                <div className='my-8'>
                    <h1 className='text-4xl font-bold tracking-tight  mb-6'>
                        {selectedBlog.title}
                    </h1>
                    <div className='flex items-center justify-between flex-wrap gap-4  mb-6'>
                        <div className='flex items-center space-x-4 '>

                            <Avatar>
                                <AvatarImage src={selectedBlog.author.photoURL} alt="author" />
                                <AvatarFallback>SS</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-medium'>{selectedBlog.author.firstName} {selectedBlog.author.lastName}</p>
                            </div>
                        </div>
                        <p className='text-sm text-muted-foreground'>Published on {changeTimeFormat(selectedBlog.createdAt)}+ 8 min read </p>
                    </div>
                </div>
                {/* featured image */}
                <div className="mb-8 rounded-lg overflow-hidden bg-black/5">
                    <img
                        src={selectedBlog.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-[500px] "
                    />
                    <p className='text-sm text-muted-foreground mt-2 italic'>{selectedBlog.subtitle}</p>
                </div>

                <p dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />




                <div className='mt-10'>
                    <div className='flex flex-wrap gap-2 mb-8'>
                        <Badge varient="secondary" className='dark:bg-gray-800 text-white'>Next.js</Badge>
                        <Badge varient="secondary" className='dark:bg-gray-800 text-white'>React</Badge>
                        <Badge varient="secondary" className='dark:bg-gray-800 text-white'>Web Development</Badge>
                        <Badge varient="secondary" className='dark:bg-gray-800 text-white'>javascript</Badge>
                    </div>

                    {/* engagement */}
                    <div className='flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8'>
                        <div className='flex items-center space-x-4'>
                            <Button onClick={likeOrDislikeHandler} variant="ghost" className="flex items-center gap-1">
                                {
                                   liked ? <FaHeart size={24} className='cursor-pointer text-red-600' /> :  <FaRegHeart size={24} className='cursor-pointer hover:text-gray-600 text-black dark:text-white' /> 
                                }
                               <span>{blogLike}</span></Button>

                            <Button variant="ghost">
                                <MessageSquare className='h-4 w-4' />
                                <span>1 comments</span>
                            </Button>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <Button variant="ghost">
                                <Bookmark className='w-4 h-4' />
                            </Button>
                            {/* // We ARE passing an argument.
                            // If we write handleShare(id) directly, it will run immediately during render.
                            // So we wrap it inside an arrow function.
                            // This gives React a function to call later when the button is clicked. */}
                            <Button onClick={() => handleShare(selectedBlog._id)} variant="ghost">
                                <Share2 className='w-4 h-4' />
                            </Button>
                        </div>

                    </div>
                </div>
                <CommentBox selectedBlog = {selectedBlog} />
            </div>
        </div>
    )
}

export default BlogView