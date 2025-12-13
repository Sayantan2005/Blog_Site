import React from 'react'
import aboutImage from "../assets/about.jpg"

function About() {
  return (
    <div className='min-h-screen pt-28 px-4 md:px-0 mb-7'>
      <div className='max-w-6xl mx-auto'>
        {/* header section */}
        <div className='text-center'>
          <h1 className='md:text-5xl text-4xl font-extrabold mb-4'>
            About our Blog
          </h1>
          <p className='text-lg'>
            A platform created to share ideas, stories, and useful knowledge that adds value to everyday learning.
          </p>
        </div>

        {/* Image+text section */}
        <div className='mt-12 grid md:grid-cols-2 gap-10 items-center'>
          <img src={aboutImage} alt="Blog Thumbnail"
            className='w-full h-72 object-cover rounded-2xl shadow-md' />
          <div>
            <p className='text-lg mb-4'>
              Welcome to our blog, a space where ideas, knowledge, and creativity come together.
              We share well-researched articles, practical insights, and thoughtful content to help you learn and grow.
            </p>
            <p className='text-lg mb-4 '>
              We believe learning should be simple and accessible to everyone.
              Through this blog, we provide easy-to-understand content, tutorials, and guides designed to support continuous learning.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed italic">
  We’re truly grateful to have you as part of our growing community.
</p>

          </div>
        </div>

        {/* Footer Quote */}
        <div className='mt-16 text-center'>
          <blackquote className="text-2xl italic text-gray-500">
            "Words are powerful. Use them to inspire. "
          </blackquote>
        </div>
      </div>
    </div>
  )
}

export default About