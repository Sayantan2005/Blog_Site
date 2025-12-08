// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Select } from '@/components/ui/select'

// import {
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { setloading } from '@/redux/authSlice'
// import { setBlog } from '@/redux/blogSlice'
// import axios from 'axios'
// import { Loader2 } from 'lucide-react'

// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'sonner'

// function CreateBlog() {

//   const [title,setTitle ] = useState("")
//   const [category,setCategory] = useState("")
//   const {blog,loading} = useSelector(store=>store.blog)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   console.log(blog)

//   const getSelectedCategory = (value)=>{
//     setCategory(value)
//   }

//   const createBlogHandler = async() => {
//     try {
//       dispatch(setloading(true))
//       const res = await axios.post(`http://localhost:3000/api/v1/blog/`,{title,category},{
//         headers:{
//           "Content-Type":"application/json"
//         },
//         withCredentials:true
//       }) //backend createblog url

//       if(res.data.success){
//         if(!blog){
//           dispatch(setBlog([res.data.blog]))
//           navigate(`/dashboard/write-blog/${res.data.blog._id}`)
//           toast.success(res.data.message)
//         }

//         dispatch(setBlog([...blog,res.data.blog]))
//         navigate(`/dashboard/write-blog/${res.data.blog._id}`)
//         toast.success(res.data.message)
//       }else{
//         toast.error("Something went wrong")
//       }
//     } catch (error) {
//       console.log(error)
//     } finally{
//       dispatch(setloading(false))
//     }
//   }


//   return (
//     <div className='p-4 md:pr-20 h-screen md:ml-80 pt-20'>

//       <Card className='md:p-10 p-4 dark:bg-gray-800 -space-y-5'>
//         <h1 className='text-2xl font-bold'>Let's create Blog</h1>
//         <p>“Share your thoughts with the world. Write, edit, and publish your blog effortlessly.”</p>
//         <div className='mt-10'>
//           <div>
//             <Label>
//               Title
//             </Label>
//             <Input type="text" placeholder="Your blog name" className="bg-white dark:bg-gray-700 mt-1" value={title} onChange={(e)=>setTitle(e.target.value)}></Input>
//           </div>
//           <div className='mt-4 mb-5'>
//             <Label className="mb-1.5 block" >
//               Category
//             </Label>
//             <Select onValueChange={getSelectedCategory}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select a Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Category</SelectLabel>
//                   <SelectItem value="Web Developement">Web Developement</SelectItem>
//                   <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
//                   <SelectItem value="Blogging">Blogging</SelectItem>
//                   <SelectItem value="Photography">Photography</SelectItem>
//                   <SelectItem value="Cooking">Cooking</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className='flex gap-2'>
//             <Button disable={loading} onClick={createBlogHandler}>
//               {
//                 loading ? <><Loader2 className='mr-1 h-4 w-4 animate-spin'/>Please wait</> : "Create"
//               }
//             </Button>
//           </div>
//         </div>


//       </Card>
//     </div>
//   )
// }

// export default CreateBlog

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { setloading } from '@/redux/blogSlice'
import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function CreateBlog() {

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")

  const blogs = useSelector((store) => store.blog.blogs) || []   // always array
  const loading = useSelector((store) => store.blog.loading)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getSelectedCategory = (value) => {
    setCategory(value)
  }

  const createBlogHandler = async () => {
    try {
      dispatch(setloading(true))

      const res = await axios.post(
        "http://localhost:3000/api/v1/blog/",
        { title, category },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )

      if (res.data.success) {

        // Add new blog
        dispatch(setBlog([...blogs, res.data.blog]))

        navigate(`/dashboard/write-blog/${res.data.blog._id}`)
        toast.success(res.data.message)
      } else {
        toast.error("Something went wrong")
      }

    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setloading(false))
    }
  }

  return (
    <div className='p-4 md:pr-20 h-screen md:ml-80 pt-20'>
      <Card className='md:p-10 p-4 dark:bg-gray-800 -space-y-5'>
        <h1 className='text-2xl font-bold'>Let's create Blog</h1>
        <p>“Share your thoughts with the world. Write, edit, and publish your blog effortlessly.”</p>

        <div className='mt-10'>

          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Your blog name"
              className="bg-white dark:bg-gray-700 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className='mt-4 mb-5'>
            <Label className="mb-1.5 block">Category</Label>

            <Select onValueChange={getSelectedCategory}>
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

          <div className='flex gap-2'>
            <Button disabled={loading} onClick={createBlogHandler}>
              {loading ? (
                <>
                  <Loader2 className='mr-1 h-4 w-4 animate-spin' />
                  Please wait
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>

        </div>
      </Card>
    </div>
  )
}

export default CreateBlog
