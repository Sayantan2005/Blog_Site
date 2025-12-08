import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-dropdown-menu'
import React, { useRef } from 'react'

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
import { useSelector } from 'react-redux'


function UpdateBlog() {
    const editor = useRef(null)
    const navigate = useNavigate()
    const params = useParams()
    console.log(params) //it gives a blogId store it on id
    const id = params.blogId

    //this might be error store.blog in video
    const {blog} = useSelector(store=>store.blog.blogs)
    
    return (
        <div className='md:ml-80 pt-20 px-3 pb-10'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className="w-full bg-white dark:bg-gray-800 p-5  -space-y-3">
                    <h1 className='text-4xl font-bold'>Basic Blog Information</h1>
                    <p>Make changes to your blogs here. Click publish when you are done</p>
                    <div className='space-x-2'>
                        <Button>Publish</Button>
                        <Button variant="destructive">Remove Blog</Button>
                    </div>
                    <div className='pt-5'>
                        <Label className='mb-1'>Title</Label>
                        <Input type="text" placeholder="Enter a title" name="title" className="dark:border-gray-300" />
                    </div>
                    <div className='pt-4'>
                        <Label className='mb-1'>Subtitle</Label>
                        <Input type="text" placeholder="Enter a subtitle" name="subtitle" className="dark:border-gray-300" />
                    </div>
                    <div>
                        <Label className='mb-1'>Description</Label>
                        <JoditEditor
                            ref={editor}
                            className='jodit_toolber'
                        />
                    </div>
                    <div>
                        <Label className='mb-1'>Category</Label>

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
                    <div>
                        <Label className='mb-1'>Thumbnail</Label>
                        <Input type="file"
                        id="file"
                        accept="image/*" //accept any format image 
                        className="w-fit dark:border-gray-300"
                        />
                    </div>

                    <div className='flex gap-3'>
                        <Button variant="outline" onClick={()=>navigate(-1)}>Back</Button>
                        <Button>Save</Button>
                    </div>
                </Card>
            </div>


        </div>
    )
}

export default UpdateBlog