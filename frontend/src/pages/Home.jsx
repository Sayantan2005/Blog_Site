import RecentBlog from '@/components/RecentBlog'
import Hero from '../components/Hero'
import { Button } from '../components/ui/button'
import React from 'react'

function Home() {
  return (
    <div className='pt-17'>
     <Hero/>
     <RecentBlog />
    </div>
  )
}

export default Home