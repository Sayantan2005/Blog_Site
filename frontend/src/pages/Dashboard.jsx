import Sidebar from '../components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div className='flex'>
        <Sidebar />
        <div className='flex-1 w-full'>
            <Outlet />
        </div>
    </div>
  )
}

export default Dashboard