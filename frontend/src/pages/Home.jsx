import RecentBlog from '@/components/RecentBlog'
import Hero from '../components/Hero'
import { Button } from '../components/ui/button'
import React from 'react'
import PopularAuthors from '@/components/PopularAuthors'
import Footer from '@/components/Footer'

function Home() {
  return (
    <div className='pt-17'>
     <Hero/>
     <RecentBlog />
     <PopularAuthors />
   
    </div>
  )
}

export default Home