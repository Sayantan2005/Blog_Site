
import { Card } from '../components/ui/card'
import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import userlogo from "../assets/userlogo.png"
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { useSelector } from 'react-redux'


function Profile() {
    const {user} = useSelector(store => store.auth)
    return (
        <div className='pt-20 md:ml-80
 md:h-screen'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
                    {/* image section */}
                    <div className='flex flex-col items-center justify-center md:w-[400px]'>
                        <Avatar className='w-40 h-40 border-2'>
                            <AvatarImage src={userlogo} />
                        </Avatar>
                        <h1 className='text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3'>Mern Stack Developer</h1>
                        <div className="flex gap-4 items-center">
                            <Link><FaFacebook className='w-6 h-6 text-gray-800 dark:text-gray-300 ' /></Link>
                            <Link><FaLinkedin className='w-6 h-6 text-gray-800 dark:text-gray-300 ' /></Link>
                            <Link><FaGithub className='w-6 h-6 text-gray-800 dark:text-gray-300 ' /></Link>
                            <Link><FaInstagram className='w-6 h-6 text-gray-800 dark:text-gray-300 ' /></Link>
                        </div>

                    </div>
                    {/* info section */}
                    <div>
                        <h1 className='font-bold text-center md:text-start text-4xl mb-7'>Welcome {user.firstName} User!</h1>
                        <p><span className='font-semibold'>Email:</span> sayantans607@gmail.com</p>
                        <div className='flex flex-col gap-2 items-start justify-start my-5'>
                            <Label>About me</Label>
                            <p className='border dark:border-gray-600 p-6 rounded-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque in repellat eaque quia sed facilis maiores reiciendis assumenda atque molestias, soluta voluptatum, totam beatae error?</p>
                        </div>

                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button >Edit Profile </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="text-center">Edit profile</DialogTitle>
                                        <DialogDescription className="text-center">
                                            Make changes to your profile here.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                        <div className='flex gap-2'>
                                            <div className="grid gap-3">
                                                <Label htmlFor="firstName"> First Name</Label>
                                                <Input id="firstName" name="firstName"
                                                    placeholder="First Name"
                                                    className="col-span-3 text-gray-500" />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" name="lastName"
                                                    placeholder="Last Name"
                                                    className="col-span-3 text-gray-500" />
                                            </div>
                                            
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className="grid gap-3">
                                                <Label htmlFor="facebook"> Facebook</Label>
                                                <Input id="facebook" name="facebook"
                                                    placeholder="Enter a URL"
                                                    type="text"
                                                    className="col-span-3 text-gray-500" />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="instagram">Instagram </Label>
                                                <Input id="instagram" name="instagram"
                                                    placeholder="Enter a URL"
                                                    type="text"
                                                    className="col-span-3 text-gray-500" />
                                            </div>
                                            
                                        </div>

                                        <div className='flex gap-2'>
                                            <div className="grid gap-3">
                                                <Label htmlFor="linkedin"> Linkedin</Label>
                                                <Input id="linkedin" name="linkedin"
                                                    placeholder="Enter a URL"
                                                    type="text"
                                                    className="col-span-3 text-gray-500" />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="github">Github </Label>
                                                <Input id="github" name="github"
                                                    placeholder="Enter a URL"
                                                    type="text"
                                                    className="col-span-3 text-gray-500" />
                                            </div>
                                            
                                        </div>

                                        <div>
                                           <Label htmlFor="bio"
                                           className="text-right mb-2">Description</Label> 
                                           <Textarea className="col-span-3 text-gray-500"
                                           placeholder="Enter a description"
                                           id="bio"
                                           name="bio"
                                          />
                                        </div>
                                        <div>
                                           <Label htmlFor="bio"
                                           className="text-right mb-2">Picture</Label>  
                                           <Input 
                                           id="file"
                                           type="file"
                                           accept="images/*"
                                           className="w-[277px]"
                                           />
                                        </div>

                                    </div>
                                    <DialogFooter>

                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </form>
                        </Dialog>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Profile