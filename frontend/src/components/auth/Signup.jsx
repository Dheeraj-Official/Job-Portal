import React, { useState,useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '../utils/constant.js';
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/authSlice.js'
import { Loader2 } from 'lucide-react';


const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: ""
  });
  const { loading,user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "content-type": "multipart/form-data"
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
   useEffect(()=>{
      if(user){
        navigate('/');
      }
    },[])
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className='flex items-center justify-center px-4'>
        <form onSubmit={submitHandler} className='w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 my-8'>
          <h1 className='font-bold text-3xl mb-8 text-center text-[#5C3D99]'>Sign Up</h1>

          <div className='space-y-5'>
            <div>
              <Label className='text-lg'>Full Name</Label>
              <Input type="text" value={input.fullName} name="fullName" onChange={changeEventHandler} placeholder="	Enter your full name" className='mt-1' />
            </div>

            <div>
              <Label className='text-lg'>Email</Label>
              <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="	Enter your email address" className='mt-1' />
            </div>

            <div>
              <Label className='text-lg'>Phone Number</Label>
              <Input type="number" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="Enter your phone number" className='mt-1' />
            </div>

            <div>
              <Label className='text-lg'>Password</Label>
              <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="	Enter a strong passwor" className='mt-1' />
            </div>

            <div>
              <Label className='text-lg block mb-2'>Role</Label>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                <div className="flex items-center space-x-2">
                  <Input type="radio" name="role" value="student" checked={input.role == 'student'} onChange={changeEventHandler} className="cursor-pointer" />
                  <Label>Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input type="radio" name="role" value="recruiter" checked={input.role == 'recruiter'} onChange={changeEventHandler} className="cursor-pointer" />
                  <Label>Recruiter</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className='text-lg block mb-2'>Profile</Label>
              <Input accept="image/*" type="file" onChange={changeFileHandler} className="cursor-pointer" />
            </div>

            {
              loading ? (
                <Button disabled className="w-full bg-[#8362be] text-white text-lg py-2 rounded-md flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-[#8362be] hover:bg-[#724bb4] text-white text-lg py-2 rounded-md transition duration-300"
                >
                  Sign UP
                </Button>
              )
            }
          </div>
          <span className='text-sm'>Already have an account?<Link to="/login" className='text-blue-400'>login</Link></span>
        </form>
      </div>
    </div>
  )
}

export default Signup
