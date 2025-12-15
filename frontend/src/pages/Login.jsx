import React, { useState } from 'react'
import auth from "../assets/auth.jpg";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux';

import { setloading, setUser } from '..//redux/authSlice';


function Login() {
  const [showPassword , setShowPassword] = useState('false')
  const {loading} = useSelector(store=>store.auth)
  const navigate = useNavigate()

  const dispatch = useDispatch()

   const [input, setInput] = useState({
      email: "",
      password: ""
    });
  
    const handleChange = (e) => {
    
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log(input)

    try {
      dispatch(setloading(true))
      const res = await axios.post("https://blog-site-2-pzsc.onrender.com/user/login",input,{
        headers:{
         "Content-Type":"application/json"
        },
        withCredentials:true
      })

      if(res.data.success){
        navigate('/')
        dispatch(setUser(res.data.user))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
        // ✅ Show error toast on UI
      toast.error(error.response?.data?.message || "Invalid credentials");
      
    } finally{
      dispatch(setloading(false))
    }

  }
  
  return (
   <div className='flex h-screen md:pt-14 md:h-[760px]'>
      <div className='hidden md:block w-1/2 '>
        <img src={auth} alt="" className='h-[700px] w-full object-cover' />
      </div>

      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600 ">
          <CardHeader >
            <CardTitle>
              <h1 className='text-center text-xl font-semibold'> Login into your account</h1>
            </CardTitle>
            <p className='mt-2 text-sm font-serif text-center dark:text-gray-300'>Enter your details below to login your account</p>
          </CardHeader>
          <CardContent>
            <form className='space-y-6 '
            onSubmit={handleSubmit}>
              <div className='flex gap-3 '>   
              </div>
              <div className='flex-1 flex flex-col gap-1'>
                <Label>Email</Label>
                <Input type="email"
                placeholder="Email Address"
                name="email"
                className="dark:border-gray-600 dark:bg-gray-900"
                value={input.email}
                onChange ={handleChange}
                 />
                
              </div>
              <div className='relative'>
                <Label>Password</Label>
                <Input type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                name="password"
                className=" mt-1.5 dark:border-gray-600 dark:bg-gray-900" 
                value={input.password}
                onChange ={handleChange}
                />
                <button type='button' className='absolute right-3 top-1 text-gray-500 -bottom-4' onClick={()=>{setShowPassword(!showPassword)}}>
                 {showPassword ? <EyeOff size={20}/> : <Eye size={20} /> } 
                </button>
              </div>
            
              <Button type="submit" className="w-full">{
                loading ? (
                  <>
                  <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
                  Please wait
                  </>
                ) : ("Login")
                }</Button>
              <p className='text-center text-gray-600 dark:text-gray-300'>Don't have any account?  <Link to={'/signup'}>
              <span className='underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100'>Sign Up</span></Link> </p>
            </form>
          </CardContent>
        </Card>
      </div>
     
    </div>
  )
}

export default Login