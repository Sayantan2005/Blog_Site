import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logo.png"
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'

// this is a static page no function is here

function Footer() {
    return (
        <footer className='bg-gray-800 text-gray-200 py-10'>
            <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
                {/* info */}
                <div className='mb-6 md:mb-0'>
                    <Link to="/" className='flex gap-3 items-center'>
                        {/* image */}
                        <img src={logo} alt="" className='invert w-12 h-12' />
                        <h1 className='text-3xl font-bold'>Blog</h1>
                    </Link>
                    <p className='mt-2'> Join our community and stay updated with fresh content every week.</p>
                    <p className='mt-2 text-sm'>
                        Sayantan Sarkar <br />
                        Kolkata, West Bengal – 743289 <br />
                        India
                    </p>
                    <p className='text-sm'>Email: sayantans@gmail.com</p>
                    <p className='text-sm'>Phone: Phone: +91 9749439983</p>
                </div>
           
            {/* Customer service link */}
            <div className='mb-6 md:mb-0'>
                <h3 className='text-xl font-semibold'>Quick Links</h3>
                <ul className='mt-2 text-sm space-y-2'>
                    <li>Home</li>
                    <li>Blogs</li>
                    <li>About Us</li>
                    <li>FAQs</li>
                </ul>
            </div>
            {/* social media links */}
            <div className='mb-6 md:mb-0'>
                <h3 className='text-xl font-semibold'>Follow Us</h3>
                <div className='flex space-x-4 mt-2'>
                    <FaFacebook />
                    <FaInstagram/>
                    <FaTwitterSquare /> 
                    <FaPinterest />
                </div>
            </div>
            {/* newsletter Subscription */}
            <div>
                <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
                <p className='mt-2 text-sm'>Sign up for our newsletter and never miss a post that matters.</p>
                <form action="" className='mt-4 flex'>
                    <input type="email" 
                    placeholder='Your email address'
                    className='w-full p-2 rounded-l-md text-black dark:text-gray-200 focus:ring-2 focus:ring-gray-500 dark:bg-gray-900 bg-gray-300 '
                    />
                    <button type='submit' className='bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700'>Subscribe</button>
                </form>
            </div>
             </div>
            {/* bottom section */}
            <div className='mt-8 border-gray-700 pt-6 text-center text-sm'>
                <p>&copy; {new Date().getFullYear()} <span className='text-red-500'>Blog</span> All rights reserved</p>
            </div>

        </footer>
    )
}

export default Footer