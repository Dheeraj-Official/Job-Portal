import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { USER_API_END_POINT } from '../utils/constant.js';
import axios from 'axios'
import { toast } from "sonner";
import { useDispatch, useSelector, } from 'react-redux'
import { setLoading,setUser } from '../redux/authSlice.js'
import { Loader2 } from 'lucide-react';



const Login = () => {
  const [input, setInput] = useState({

    email: "",
    password: "",
    role: "",
  });
  const { loading,user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();


    try {
      dispatch(setLoading(true));
      
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "content-Type": "application/json"
        },
       
      });
      // store in localstoreage
      localStorage.setItem("token", res.data.token);
      if (res.data.success) {
       
        dispatch(setUser(res.data.userData));
        navigate("/");
        toast.success(res.data.message);

      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
          <h1 className='font-bold text-3xl mb-8 text-center text-[#5C3D99]'>Log in</h1>

          <div className='space-y-5'>


            <div>
              <Label className='text-lg'>Email</Label>
              <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="	Enter your email address" className='mt-1' />
            </div>



            <div>
              <Label className='text-lg'>Password</Label>
              <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="Enter your password" className='mt-1' />
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
                  Login
                </Button>
              )
            }

          </div>
          <span className='text-sm'>Don't have an account?<Link to="/signup" className='text-blue-400'>Signup</Link></span>
        </form>
      </div>
    </div>
  )
}




export default Login
