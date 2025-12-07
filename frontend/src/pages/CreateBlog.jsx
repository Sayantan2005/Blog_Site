import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import React, { useState } from 'react'

function CreateBlog() {

  const [title,setTitle ] = useState("")
  const [category,setCategory] = useState("")

  return (
    <div className='p-4 md:pr-20 h-screen md:ml-80 pt-20'>

      <Card className='md:p-10 p-4 dark:bg-gray-800'>
        <h1 className='text-2xl font-bold'>Let's create Blog</h1>
        <p>“Share your thoughts with the world. Write, edit, and publish your blog effortlessly.”</p>
        <div className='mt-5'>
          <div>
            <Label>
              Title
            </Label>
            <Input type="text" placeholder="Your blog name" className="bg-white dark:bg-gray-700 mt-1"></Input>
          </div>
          <div className='mt-4 mb-5'>
            <Label className="mb-1.5 block" >
              Category
            </Label>
            <Select>
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
            <Button>Create</Button>
          </div>
        </div>


      </Card>
    </div>
  )
}

export default CreateBlog