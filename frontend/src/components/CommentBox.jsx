
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { LuSend } from "react-icons/lu";
import axios from 'axios'
import { setComment } from '@/redux/commentSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'sonner'
// import BlogCard from './BlogCard'
import { setBlog } from '@/redux/blogSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDots } from 'react-icons/bs'
import { Edit, Trash2 } from 'lucide-react'



function CommentBox({ selectedBlog }) {
    const { user } = useSelector(store => store.auth)
    const { blogs } = useSelector(store => store.blog)
    const { comments } = useSelector(store => store.comment)
    const dispatch = useDispatch()

    // state for post comment
    const [content, setContent] = useState("")
    // state for editing
    const [editingCommentId , setEditingCommentId] = useState(null)
    const [editedContent , setEditedContent] = useState("")

    // function for set comment to content
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setContent(inputText)
        } else {
            setContent("")
        }
    }
    // post a new commment 
    const commentHandler = async () => {
        // ❌ Stop execution if comment box is empty or only spaces
        if (!content.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            // 🔹 Send POST request to backend to create a new comment
            const res = await axios.post(
                `http://localhost:3000/api/v1/comment/${selectedBlog._id}/create`,
                { content }, // comment text sent to backend
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true, // allows cookies/JWT to be sent
                }
            );

            // ✅ Check if backend successfully created the comment
            if (res.data.success) {

                let updatedCommentData;

                // 🔹 If there are already comments, append new one
                if (comments?.length >= 1) {
                    updatedCommentData = [...comments, res.data.comment];
                }
                // 🔹 If this is the first comment, create array
                else {
                    updatedCommentData = [res.data.comment];
                }

                // 🔹 Update comment state in Redux
                dispatch(setComment(updatedCommentData));

                // 🔹 Update blogs in Redux so UI stays in sync
                const updatedBlogData = blogs.map(blog =>
                    blog._id === selectedBlog._id
                        ? { ...blog, comments: updatedCommentData }
                        : blog
                );

                // 🔹 Save updated blog list to Redux
                dispatch(setBlog(updatedBlogData));

                // 🔹 Show success message
                toast.success(res.data.message);

                // 🔹 Clear textarea after comment is posted
                setContent("");
            }
        } catch (error) {
            // ❌ Handle server / network errors
            console.log(error);
            toast.error("Comment not added");
        }
    };


    // fetch all comments of a post
    useEffect(() => {
        const getAllcommentsofBlog = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/comment/${selectedBlog._id}/comment/all`)

                console.log(res)

                const data = res.data.comments
                // console.log(data)

                dispatch(setComment(data))


            } catch (error) {
                console.log(error)
            }
        }
        getAllcommentsofBlog()
    }, [])

    // delete a comment
    const deleteComment = async (commentId) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/v1/comment/${commentId}/delete`,{
                withCredentials:true
            })
            if(res.data.success){
                const updatedCommentData = comments.filter((item)=>item._id !== commentId)
                dispatch(setComment(updatedCommentData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Comment not deleted")
        }
    }

    // edit a comment
 const editCommentHandler = async (commentId) => {
    try {
        // 🔹 Send PUT request to backend to update a specific comment
        // commentId → identifies which comment to edit
        // editedContent → new updated text
        const res = await axios.put(
            `http://localhost:3000/api/v1/comment/${commentId}/edit`,
            { content: editedContent }, // request body
            {
                withCredentials: true, // send auth cookies/JWT
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // ✅ If backend confirms comment update
        if (res.data.success) {

            // 🔹 Update comments in Redux without mutating state
            // Loop through all comments:
            // - if comment ID matches → update its content
            // - otherwise → keep comment unchanged
            const updatedCommentData = comments.map(item =>
                item._id === commentId
                    ? { ...item, content: editedContent }
                    : item
            );

            // 🔹 Save updated comments list to Redux store
            dispatch(setComment(updatedCommentData));

            // 🔹 Show success message to user
            toast.success(res.data.message);

            // 🔹 Exit edit mode
            setEditingCommentId(null);

            // 🔹 Clear edited content state
            setEditedContent("");
        }
    } catch (error) {
        // ❌ Handles API / permission / network errors
        console.log(error);
        toast.error("Failed to edit comment");
    }
};

    // like comment handler
const likeCommentHandler = async (commentId) => {
    try {
        // 🔹 Send request to backend to like / unlike a comment
        // commentId → identifies which comment is being liked
        // withCredentials → sends auth cookies/JWT
        const res = await axios.get(
            `http://localhost:3000/api/v1/comment/${commentId}/like`,
            { withCredentials: true }
        );

        // ✅ If backend successfully processed like/unlike
        if (res.data.success) {

            // 🔹 Backend returns the updated comment
            // (likes array & numberOfLikes already updated)
            const updatedComment = res.data.updatedComment;

            // 🔹 Update comments list immutably in Redux
            // Replace only the liked comment, keep others unchanged
            const updatedCommentList = comments.map(item =>
                item._id === commentId ? updatedComment : item
            );

            // 🔹 Save updated comments to Redux store
            dispatch(setComment(updatedCommentList));

            // 🔹 Show feedback message (Liked / Unliked)
            toast.success(res.data.message);
        }
    } catch (error) {
        // ❌ Handles network, auth, or server errors
        console.log("Error liking comment", error);
        toast.error("Something went wrong");
    }
};




    return (
        <div>
            <div className='flex gap-4 mb-4 items-center'>
                <Avatar>
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h3 className='font-semibold'>{user.firstName} {user.lastName}</h3>
            </div>
            <div className='flex gap-3 items-center'>
                <Textarea
                    placeholder="Leave a comment"
                    className="bg-gray-100 dark:bg-gray-800"
                    value={content}
                    onChange={changeEventHandler}

                />
                <Button
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                    onClick={commentHandler}
                >
                    <LuSend className="w-4 h-4" />
                </Button>

            </div>
            {
                comments?.length > 0 ? <div className='mt-7 bg-gray-100 dark:bg-gray-800 p-5 rounded-md'>
                    {
                        comments.map((item, index) => {
                            return <div key={index} className='mb-4'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex gap-3 items-start'>
                                        <Avatar>
                                            <AvatarImage src={item?.userId?.photoURL} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className='mt-2 space-y-1 md:w-[400px]'>
                                            <h1 className='font-semibold'>{item?.userId?.firstName} {item?.userId?.lastName} <span className='text-sm ml-2 font-light'>Yesterday</span></h1>

                                            {
                                                editingCommentId === item?._id ? (
                                                    <>
                                                    <Textarea
                                                    value={editedContent}
                                                    onChange={(e)=>setEditedContent(e.target.value)}
                                                    className="mb-2 bg-gray-200 dark:bg-gray-700"
                                                    />
                                                    <div className='flex py-1 gap-2'>
                                                        <Button onClick = {()=>editCommentHandler(item._id)}>Save</Button>
                                                        <Button variant="outline" onClick = {()=>setEditingCommentId(null)}>Cancel</Button>
                                                    </div>
                                                    </>  
                        ) :   <p>{item?.content}</p>

                                            }
                                          
                                            <div className='flex gap-5 items-center'>
                                                <div className='flex gap-2 items-center'>
                                                    <div onClick={()=>likeCommentHandler(item._id)} className='flex gap-1 items-center cursor-pointer'>
                                                        {
                                                            item.likes.includes(user._id) ? <FaHeart fill='red' /> : <FaRegHeart />
                                                        }
                                                        
                                                        <span>{item?.numberOfLikes}</span>
                                                    </div>
                                                </div>
                                                <p className='text-sm cursor-pointer'>Reply</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* only a log in user can delete his comment */}
                                    {
                                        user._id === item?.userId?._id ? <DropdownMenu>
                                            <DropdownMenuTrigger><BsThreeDots/></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick = {()=>{
                                                    setEditingCommentId(item._id)
                                                    setEditedContent(item.content)
                                                }}><Edit/>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick = {()=>deleteComment(item._id)} className="text-red-500"><Trash2/>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu> : null
                                    }
                                </div>
                            </div>
                        })
                    }

                </div> : null
            }
        </div>
    )
}

export default CommentBox