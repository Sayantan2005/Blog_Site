import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" 
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Comments() {
  const navigate = useNavigate()

  // state for holding all comments
  const [allComments , setAllComments] = useState([])

  const getTotalComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/comment/my-blogs/comments`,{
        withCredentials:true
      })
      if(res.data.success){
        setAllComments(res.data.comments)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getTotalComments()
  },[])

  return (
    <div className='pb-10 pt-20 md:ml-80 min-h-screen'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
      <TableCaption>A list of your recent comments.</TableCaption>
      <TableHeader>
        <TableRow>
          
          <TableHead>Blog Title</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Author</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allComments.map((comment,index) => (
          <TableRow key={index}>
            <TableCell className="font-medium ">
              <h1 className='w-[60px] truncate md:w-full'>{comment.postId.title}</h1>
              </TableCell>
            <TableCell>
              <h1 className='w-[60px] truncate md:w-[320px] md:wrap-break-words md:whitespace-normal '>
                {comment.content}
              </h1>
              </TableCell>
            <TableCell>{comment.userId.firstName}</TableCell>
             <TableCell className="text-right">
    <div className="flex justify-center items-center">
      <Eye
        className="cursor-pointer"
        onClick={() => navigate(`/blogs/${comment.postId._id}`)}
      />
    </div>
  </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
        </Card>
      </div>
    </div>
  )
}

export default Comments