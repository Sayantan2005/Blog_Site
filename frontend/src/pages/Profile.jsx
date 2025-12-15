
import { Card } from '../components/ui/card'
import React, { useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { setloading, setUser } from '@/redux/authSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import TotalProperty from '@/components/TotalProperty'


function Profile() {
    const [open, setOpen] = useState(false)
    const { user ,loading } = useSelector(store => store.auth)
    
    const dispatch = useDispatch()
    const [input, setInput] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        occupation: user?.occupation,
        bio: user?.bio,
        facebook: user?.facebook,
        instagram: user?.instagram,
        linkedin: user?.linkedin,
        github: user?.github,
        file: user?.photoURL
    })

    const changeEventHandler = (e) => {

        // Extract the "name" and "value" from the input field 
        // Example: <input name="firstName" value="John" />
        // name = "firstName", value = "John"
        const { name, value } = e.target;

        // Update the input state dynamically
        setInput(prevState => ({

            // Spread previous state so other fields don't get removed
            ...prevState,

            // Update only the field that changed
            // Example: if name="firstName", this becomes:
            // firstName: "John"
            [name]: value
        }));
    };

    // for change files
    const changeFileHandler = (e) => {

        // e.target.files is an array-like object containing selected files.
        // For example: [ File { name: "photo.png", size: 12345 } ]
        // We take the first file using files[0].

        const selectedFile = e.target.files?.[0];
        // The ?. ensures no error if no file is selected.

        // Update the state by copying the old input values (...input)
        // and then adding/updating the "file" field with the selected file.
        setInput({
            ...input,   // keep all other form fields unchanged
            file: selectedFile  // store the actual file object
        });
    };


    // submit handler
    const submitHandler = async (e) => {
        e.preventDefault()

        // becuase we upload a image thats why we send form data instead of json data so make this formdata
        const formData = new FormData();
        formData.append("firstName", input.firstName);
        formData.append("lastName", input.lastName);
        formData.append("bio", input.bio);
        formData.append("occupation", input.occupation);
        formData.append("facebook", input.facebook);
        formData.append("linkedin", input.linkedin);
        formData.append("instagram", input.instagram);
        formData.append("github", input.github);
        
        if (input?.file) {
            formData.append("file", input?.file);
        }


        console.log(input)
        try {
            dispatch(setloading(true))
            const res = await axios.put("https://blog-site-2-pzsc.onrender.com/user/profile/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })

            if (res.data.success) {
                setOpen(false)
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
            }
        } catch (error) {
            console.log(error);

        } finally {
            dispatch(setloading(false))
        }
    }

    return (
        <div className='pt-20 md:ml-80
 md:h-screen'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
                    {/* image section */}
                    <div className='flex flex-col items-center justify-center md:w-[400px]'>
                        <Avatar className='w-40 h-40 border-2'>
                            <AvatarImage src={user.photoURL || userlogo} />
                        </Avatar>
                        <h1 className='text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3'>{user.occupation || "Mern Stack Developer"}</h1>
                        <div className="flex gap-4 items-center">
                            <Link><FaFacebook className='w-6 h-6 text-gray-800 dark:text-gray-300 ' /></Link>
                            <Link><FaLinkedin className='w-6 h-6 text-gray-800 dark:text-gray-300 ' /></Link>
                            <Link><FaGithub className='w-6 h-6 text-gray-800 dark:text-gray-300 ' /></Link>
                            <Link><FaInstagram className='w-6 h-6 text-gray-800 dark:text-gray-300 ' /></Link>
                        </div>

                    </div>
                    {/* info section */}
                    <div>
                        <h1 className='font-bold text-center md:text-start text-4xl mb-7'>Welcome {user.firstName || "User!"}</h1>
                        <p><span className='font-semibold'>Email:</span> {user.email}</p>
                        <div className='flex flex-col gap-2 items-start justify-start my-5'>
                            <Label>About me</Label>
                            <p className='border dark:border-gray-600 p-6 rounded-lg'>{user.bio || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque in repellat eaque quia sed facilis maiores reiciendis assumenda atque molestias, soluta voluptatum, totam beatae error?"}</p>
                        </div>

                        <Dialog open={open} onOpenChange={setOpen}>
                           
                                <Button onClick={()=>{setOpen(true)}} >Edit Profile </Button>

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
                                                    className="col-span-3 text-gray-500"
                                                    value={input.firstName}
                                                    onChange={changeEventHandler} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" name="lastName"
                                                    placeholder="Last Name"
                                                    className="col-span-3 text-gray-500"
                                                    value={input.lastName}
                                                    onChange={changeEventHandler} />
                                            </div>

                                        </div>
                                        <div className='flex gap-2'>
                                            <div className="grid gap-3">
                                                <Label htmlFor="facebook"> Facebook</Label>
                                                <Input id="facebook" name="facebook"
                                                    placeholder="Enter a URL"
                                                    type="text"
                                                    className="col-span-3 text-gray-500"
                                                    value={input.facebook}
                                                    onChange={changeEventHandler} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="instagram">Instagram </Label>
                                                <Input id="instagram" name="instagram"
                                                    placeholder="Enter a URL"
                                                    type="text"
                                                    className="col-span-3 text-gray-500"
                                                    value={input.instagram}
                                                    onChange={changeEventHandler} />
                                            </div>

                                        </div>

                                        <div className='flex gap-2'>
                                            <div className="grid gap-3">
                                                <Label htmlFor="linkedin"> Linkedin</Label>
                                                <Input id="linkedin" name="linkedin"
                                                    placeholder="Enter a URL"
                                                    type="text"
                                                    className="col-span-3 text-gray-500"
                                                    value={input.linkedin}
                                                    onChange={changeEventHandler} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="github">Github </Label>
                                                <Input id="github" name="github"
                                                    placeholder="Enter a URL"
                                                    type="text"
                                                    className="col-span-3 text-gray-500"
                                                    value={input.github}
                                                    onChange={changeEventHandler} />
                                            </div>

                                        </div>

                                        <div>
                                            <Label htmlFor="bio"
                                                className="text-right mb-2">Description</Label>
                                            <Textarea className="col-span-3 text-gray-500"
                                                placeholder="Enter a description"
                                                id="bio"
                                                name="bio"
                                                value={input.bio}
                                                onChange={changeEventHandler}
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
                                                onChange={changeFileHandler}
                                            />
                                        </div>

                                    </div>
                                    <DialogFooter>

                                        <Button onClick={submitHandler} type="submit">
                                            {
                                                loading ? (
                                                    <>
                                                    <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
                                                    Please wait
                                                    </>
                                                ) : ("Save Changes")
                                            }
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                          
                        </Dialog>
                    </div>
                </Card>
            </div>
            <TotalProperty />
        </div>
    )
}

export default Profile