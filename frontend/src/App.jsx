import React from 'react'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import About from './pages/About'
import Login from './pages/Login'
import SIgnup from './pages/Signup'

const router = createBrowserRouter([
  {
    path:"/",
    element: <Home/>
  },
  {
    path:"/blogs",
    element: <Blogs/>
  },
  {
    path:"/about",
    element: <About/>
  },
  {
    path:"/login",
    element: <Login/>
  },
  {
    path:"/signup",
    element: <SIgnup/>
  },

])

function App() {
  return (
    <div className='text-red-500 text-6xl'>
      Hello world
    </div>
  )
}

export default App
