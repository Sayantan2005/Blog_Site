import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-dropdown-menu'
import React, { useRef, useState } from 'react'

import JoditEditor from 'jodit-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog, setloading } from '@/redux/blogSlice'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'


function UpdateBlog() {
    const editor = useRef(null)
    const navigate = useNavigate()
    const params = useParams()
    // console.log(params) //it gives a blogId store it on id
    const id = params.blogId
    const dispatch = useDispatch()

    // this might be error store.blog in video
// const { blogs } = useSelector(store => store.blog); ---> this ios also correct
 

    const blogs = useSelector(store=>store.blog.blogs)
    const {loading} = useSelector(store=>store.blog)

    const selectBlog = blogs.find(blog=>blog._id === id)

    const [content,setContent] = useState(selectBlog.description)

    const [blogData,setBlogData] = useState({
        title:selectBlog?.title,
        subtitle:selectBlog?.subtitle,
        description:content,
        category:selectBlog?.category

    })

    const [publish,setPublish] = useState(false)

    const [previewthumbnail,setPreviewThumbnail] = useState(selectBlog?.thumbnail)

    const handleChange = (e) =>{
        const {name,value} = e.target
        setBlogData((prev)=>({
            ...prev,
            [name]:value

        }) )
    }

    const selectCategory = (value) => {
        setBlogData({
            ...blogData,category:value
        })
    }

  const selectThumbnail = (e) => {
    // get the selected file from input[type="file"]
    const file = e.target.files?.[0];

    // if a file is selected
    if (file) {
        // update blogData state and store original file (for backend upload)
        setBlogData({ ...blogData, thumbnail: file });

        // create a FileReader to read the file
        const fileReader = new FileReader();

        // onload runs AFTER fileReader successfully reads the file
        fileReader.onload = () => {
            // set preview image to the base64 string returned by FileReader
            setPreviewThumbnail(fileReader.result);
        };

        // convert the image file into a base64 URL so it can be displayed in <img>
        fileReader.readAsDataURL(file);
    }
};


    const updateBlogHandler = async () =>{
        const formData = new FormData()
        formData.append("title",blogData.title)
        formData.append("subtitle",blogData.subtitle)
        formData.append("description",content)
        formData.append("category",blogData.category)
        formData.append("file",blogData.thumbnail)
        try {
            dispatch(setloading(true))
            const res = await axios.put(`https://blog-site-2-pzsc.onrender.com/api/v1/blog/${id}`,formData,
                {headers:{
                    "Content-Type":"multipart/form-data"
                },
                withCredentials:true
                }

            )
            if(res.data.success){
                toast.success(res.data.message)
                console.log(blogData);
                
            }
        } catch (error) {
           console.log(error);
           toast.error(error.response?.data?.message || "Blog is not Updated");
            
        }finally{
            dispatch(setloading(false))
        }

    }

  // Function to publish or unpublish a blog
// 'action' will be either "publish" or "unpublish"
const togglePublishUnpublish = async (action) => {
    try {
        // Making a PATCH request to backend
        // 1st argument → API URL with blog id
        // 2nd argument → request body (empty because we are not sending body data)
        // 3rd argument → config object (params + cookies)
        const res = await axios.patch(
            `https://blog-site-2-pzsc.onrender.com/api/v1/blog/${id}`,
            {},  // no body content, we only need params
            {
                // params: { action },         // sending the action to backend (publish/unpublish) we dont need it now
                withCredentials: true       // send cookies (for authentication)
            }
        );

        // If API returns success = true
        if (res.data.success) {

            // Toggle local publish state (true → false / false → true)
            setPublish(!publish);

            // Show success toast message
            toast.success(res.data.message);

            // Redirect user to 'your blogs' page
            navigate('/dashboard/your-blog');
        }

    } catch (error) {

        // If something went wrong, log error for debugging
        console.log(error);

        // Show error toast message to user
        toast.error("Failed to update");
    }
};


const deleteBlog = async () => {
    try {
        const res = await axios.delete(`https://blog-site-2-pzsc.onrender.com/api/v1/blog/delete/${id}`,{withCredentials:true})

        if(res.data.success){
            const updateBlogData = blogs.filter((blogItem) => blogItem._id !== id)
            dispatch(setBlog(updateBlogData))
            toast.success(res.data.message)
            navigate('/dashboard/your-blog')
        }
    } catch (error) {
     console.log(error)
     toast.error("Something went wrong")   
    }
}



    return (
        <div className='md:ml-80 pt-20 px-3 pb-10'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className="w-full bg-white dark:bg-gray-800 p-5  -space-y-3">
                    <h1 className='text-4xl font-bold'>Basic Blog Information</h1>
                    <p>Make changes to your blogs here. Click publish when you are done</p>
                    <div className='space-x-2'>
                        <Button onClick={()=>togglePublishUnpublish(selectBlog.isPublished ? "false" : "true")}>
                            {
                                selectBlog.isPublished ? "Unpublish" : "Publish"
                            }
                        </Button>
                        <Button onClick={deleteBlog}variant="destructive">Remove Blog</Button>
                    </div>
                    <div className='pt-5'>
                        <Label className='mb-1'>Title</Label>
                        <Input type="text" placeholder="Enter a title" value={blogData.title} onChange={handleChange} name="title" className="dark:border-gray-300" />
                    </div>
                    <div className='pt-4'>
                        <Label className='mb-1'>Subtitle</Label>
                        <Input type="text" placeholder="Enter a subtitle" name="subtitle" className="dark:border-gray-300" value={blogData.subtitle} onChange={handleChange}  />
                    </div>
                    <div>
                        <Label className='mb-1'>Description</Label>
                        <JoditEditor
                            ref={editor}
                            className='jodit_toolber'
                            onChange={newContent => setContent(newContent)}
                            value={blogData.description}
                        />
                    </div>
                    <div>
                        <Label className='mb-1'>Category</Label>

                        <Select onValueChange={selectCategory} className="dark:border-gray-300">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="Web Developement">Web Developement</SelectItem>
                                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                    <SelectItem value="Blogging">Blogging</SelectItem>
                                    <SelectItem value="Photography">Photography</SelectItem>
                                    <SelectItem value="Cooking">Cooking</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className='mb-1'>Thumbnail</Label>
                        <Input type="file"
                        id="file"
                        onChange={selectThumbnail}
                        accept="image/*" //accept any format image 
                        className="w-fit dark:border-gray-300"

                        />
                        {
                            previewthumbnail && (
                                <img src={previewthumbnail} className='w-64 my-2' alt="Blog Thumbnail" />
                            )
                        }
                    </div>

                    <div className='flex gap-3'>
                        <Button variant="outline" onClick={()=>navigate(-1)}>Back</Button>
                        <Button onClick={updateBlogHandler}>
                            {
                                loading ?<> <Loader2 className='mr-2 w-4 h-4 animate-spin'/> Please wait </> : "Save" 
                            }
                        </Button>
                    </div>
                </Card>
            </div>


        </div>
    )
}

export default UpdateBlog