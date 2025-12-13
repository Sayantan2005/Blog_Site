import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ChartColumnBig, Search, User } from 'lucide-react'
import { FaMoon, FaSun } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/themeSlice'
import { toast } from 'sonner'
import { setUser } from '../redux/authSlice'
import axios from 'axios'
import { LiaCommentSolid } from "react-icons/lia";
import { FaRegEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import userLogo from "../assets/userlogo.png"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"



function Navbar() {
    const user = useSelector(store => store.auth.user)
    const dispatch = useDispatch()
    const theme = useSelector(store => store.theme.theme)

// state for search
    const [searchTerm,setSearchTerm] = useState("")

// function for handle search
const handleSearch = (e) => {
    // 🔹 Prevents the default browser behavior
    // (Without this, the page would reload when the form is submitted)
    e.preventDefault();

    // 🔹 Check if the search input is NOT empty
    // trim() removes extra spaces from beginning and end
    if (searchTerm.trim() !== "") {

        // 🔹 Navigate to the search page with query parameter
        // encodeURIComponent() makes the search term URL-safe
        // Example: "react hooks" → "react%20hooks"
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);

        // 🔹 Clear the search input after navigating
        setSearchTerm("");
    }
};



    const navigate = useNavigate()

    const logoutHandler = async (e) => {
        try {
           
            const res = await axios.get(`http://localhost:3000/api/v1/user/logout`, { withCredentials: true })
            if (res.data.success) {
                navigate('/')
                dispatch(setUser(null))
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }
    return (
        <div className='py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-300 border-2 bg-white z-50'>
            <div className='max-w-7xl mx-auto px-4 flex justify-between items-center md:px-0'>
                {/* logo section */}
                <div className='flex gap-7 items-center'>
                    <Link to={'/'}>
                        <div className='flex gap-2 items-center'>
                            <img src={Logo} alt="" className='w-7 h-7 md:w-10 md:h-10 dark:invert' />

                            <h1 className='font-bold text-3xl md:text-4xl '>Blog</h1>

                        </div>
                    </Link>
                    <div className='relative hidden md:block'>
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange = {(e)=>setSearchTerm(e.target.value)}
                            onClick = {handleSearch}
                            className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px] hidden md:block" />

                        <Button className="absolute right-0 top-0"><Search /></Button>
                    </div>

                </div>
                {/* nav section */}
                <nav className='flex md:gap-7 gap-4 items-center'>
                    <ul className='hiddne md:flex gap-7 items-center text-xl font-semibold'>
                        <Link to={'/'}><li>Home</li></Link>
                        <Link to={'/about'}><li>About</li></Link>
                        <Link to={'/blogs'}><li>Blogs</li></Link>
                    </ul>
                    <div className='flex '>
                        <Button onClick={() => dispatch(toggleTheme())}>
                            {theme === 'light' ? <FaMoon /> : <FaSun />}</Button>
                        {
                            user ? <div className='ml-7 flex gap-3 items-center'>




                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar>
                                            <AvatarImage src={user.photoURL || userLogo} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onSelect={() => navigate('/dashboard/profile')}>
                                                <User />
                                                <span>Profile</span>
                                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => navigate('/dashboard/your-blog')}>
                                                <ChartColumnBig />
                                                <span>Your Blogs</span>
                                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => navigate('/dashboard/comments')}>
                                                <LiaCommentSolid />
                                                <span>Comments</span>
                                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => navigate('/dashboard/write-blog')}>
                                                <FaRegEdit />
                                                <span>Write Blog</span>
                                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem>
                                            <FiLogOut />
                                            <span>Log out</span>
                                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button onClick={logoutHandler} >Logout</Button>
                            </div> : <div className='ml-7 md:flex gap-2'>
                                <Link to={'/login'}><Button>Login</Button></Link>
                                <Link className='hidden md:block' to={'/signup'}><Button>Signup</Button></Link>
                            </div>
                        }
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Navbar