import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logo.png"

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

        </footer>
    )
}

export default Footer