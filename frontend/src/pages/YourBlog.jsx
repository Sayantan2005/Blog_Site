import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]


function YourBlog() {

  const dispatch = useDispatch()
  const { blogs } = useSelector(store => store.blog)
  console.log(blogs)

  const getOwnBlog = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/blog/get-own-blogs", { withCredentials: true })
      if (res.data.success) {
        dispatch(setBlog(res.data.blogs))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getOwnBlog()
  }, [])
  return (
    <div className='pb-10 pt-20 md:ml-80 h-screen'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800" >
          <Table>
            <TableCaption>A list of your recent blogs.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="flex gap-4 items-center">
                    <img src={item.thumbnail} className='w-20 rounded-md hidden md:block' alt="" />
                    <h1 className='hover:underline cursor-pointer'>{item.title}</h1>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right"><BsThreeDotsVertical />
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

export default YourBlog