import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogCardList from './BlogCardList'
import { Badge } from './ui/badge'

function RecentBlog() {
    const dispatch = useDispatch()
    const {blogs} = useSelector(store=>store.blog)
    useEffect(()=>{
        const getAllPublishedBlogs = async()=>{
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/blog/get-published-blogs`,{withCredentials:true})

                if(res.data.success){
                    dispatch(setBlog(res.data.blogs))
                }
            } catch (error) {
                console.log(error)
            }
        };
        getAllPublishedBlogs();
    },[])
  return (
    <div className='bg-gray-100 dark:bg-gray-800 pb-10'>
        <div className='max-w-6xl mx-auto flex flex-col space-y-4 items-center'>
            <h1 className='text-4xl font-bold pt-10'>Recent Blogs</h1>
            <hr className='w-24 text-center border-2 border-red-500 rounded-full' />

        </div>
        <div className='max-w-7xl mx-auto flex gap-5 justify-around'>
            <div>
                <div className='mt-10 px-4 md:px-0'>
                    {
                        blogs?.slice(0,4)?.map((blog,index)=>{
                            return <BlogCardList key={index} blog={blog}/>
                        })
                    }
                </div>
            </div>
            <div className='bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10'>

                <h1 className='text-2xl font-semibold'>Popular Categories</h1>
                <div className='my-5 flex flex-wrap gap-3'>
                    {
                        ["Blogging","Web Development","Digital Marketing" , "Cooking" , "Photography","Sports"].map((item,index)=>{
                            return <Badge>{item}</Badge>  
                        })
                    }
                </div>

            </div>
        </div>
         
    </div>
  )
}

export default RecentBlog