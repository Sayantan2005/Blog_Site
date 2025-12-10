import React from 'react'
import { useSelector } from 'react-redux'
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


function BlogView() {
    const params = useParams()
    const blogId = params.blogId
    const { blogs } = useSelector(store => store.blog)

    const selectedBlog = blogs.find(blog => blog._id === blogId)
    console.log(selectedBlog)

    const changeTimeFormat = (isDate) => {
        const date = new Date(isDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = date.toLocaleDateString('en-GB', options)
        return formattedDate
    }
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
                </div>
            </div>
        </div>
    )
}

export default BlogView