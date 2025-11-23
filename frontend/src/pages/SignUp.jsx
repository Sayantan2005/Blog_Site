import React, { useState } from 'react'
import auth from "../assets/auth.jpg"
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'

function SIgnup() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  // Local state to store form input values
  // We keep all fields inside one object called 'user'
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  // This function handles all input changes dynamically
  // 'name' → which input field (firstName / lastName / email / password)
  // 'value' → typed text by user
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Updating only the changed field using spread operator (...prev)
    // This keeps the other values unchanged
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submit handler
  // Prevent page refresh using e.preventDefault()
  // For now, just printing user data to console
  const handleSubmit = async (e) => {
    console.log(e)
    e.preventDefault();
    console.log(user);

    // connect the register Api (backend code) with the front end SignUp form
    try {
      // Sending HTTP POST request to backend API
      // Sending 'user' data (firstName, lastName, email, password)
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",  // Backend API register route
        user,                                          // Data we send in request body

        {
          headers: {
            "Content-Type": "application/json"
            // Telling backend that we are sending JSON data
            // Otherwise server may not read the request properly
          },

          withCredentials: true
          // Allows cookies (like refresh token or auth token) 
          // to be included in the request
          // Needed for authentication systems using cookies
        }

      );

      if (res.data.success) {
        navigate('/login')
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  };



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
            <form className='space-y-6 ' onSubmit={handleSubmit}>
              <div className='flex gap-3 '>
                <div className='flex-1 flex flex-col gap-1' >
                  <Label>
                    First Name
                  </Label>
                  <Input type="text" placeholder="First Name"
                    name="firstName"
                    className="dark:border-gray-600 dark:bg-gray-900"
                    value={user.firstName}
                    onChange={handleChange} />
                </div>
                <div className='flex-1 flex flex-col gap-1'>
                  <Label>
                    Last Name
                  </Label>
                  <Input type="text" placeholder="Last Name"
                    name="lastName"
                    className="dark:border-gray-600 dark:bg-gray-900"
                    value={user.lastName}
                    onChange={handleChange} />
                </div>

              </div>
              <div className='flex-1 flex flex-col gap-1'>
                <Label>Email</Label>
                <Input type="email"
                  placeholder="john.doe@example.com"
                  name="email"
                  className="dark:border-gray-600 dark:bg-gray-900"
                  value={user.email}
                  onChange={handleChange} />

              </div>
              <div className='relative'>
                <Label>Password</Label>
                <Input type={showPassword ? "text" : "password"}
                  placeholder="Create a Password"
                  name="password"
                  className=" mt-1.5 dark:border-gray-600 dark:bg-gray-900"
                  value={user.password}
                  onChange={handleChange}
                />
                <button type='button' className='absolute right-3 top-1 text-gray-500 -bottom-4' onClick={() => { setShowPassword(!showPassword) }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button type="submit" className="w-full">Sign Up</Button>
              <p className='text-center text-gray-600 dark:text-gray-300'>Already have an account? <Link to={'/login'}>
                <span className='underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100'>Sign in</span></Link> </p>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default SIgnup