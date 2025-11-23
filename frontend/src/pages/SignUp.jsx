import React from 'react'
import auth from "../assets/auth.jpg"
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'

function SIgnup() {
  return (
    <div className='flex h-screen md:pt-14 md:h-[760px]'>
      <div className='hidden md:block w-1/2 '>
        <img src={auth} alt="" className='h-[700px] w-full object-cover' />
      </div>

      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600 ">
          <CardHeader >
            <CardTitle>
              <h1 className='text-center text-xl font-semibold'>Create an account</h1>
            </CardTitle>
            <p className='mt-2 text-sm font-serif text-center dark:text-gray-300'>Enter your details below to create your account</p>
          </CardHeader>
          <CardContent>
            <form className='space-y-4 '>
              <div className='flex gap-3 '>
                <div className='flex-1 flex flex-col gap-1' >
                  <Label>
                    First Name
                  </Label>
                  <Input type="text" placeholder="First Name"
                  name="firstName"
                  className="dark:border-gray-600 dark:bg-gray-900" />
                </div>
                <div className='flex-1 flex flex-col gap-1'>
                  <Label>
                    Last Name
                  </Label>
                  <Input type="text" placeholder="Last Name"
                  name="lastName"
                  className="dark:border-gray-600 dark:bg-gray-900" />
                </div>
                
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
     
    </div>
  )
}

export default SIgnup