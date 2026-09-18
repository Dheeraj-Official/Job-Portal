import { Label } from '@radix-ui/react-label'
import React from 'react'
import { useState } from 'react'
import { useViewTransitionState } from 'react-router-dom'
import { Input } from "@/components/ui/input";
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "../components/ui/dialog";
import { USER_API_END_POINT } from './utils/constant';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/authSlice';
import { Loader2 } from 'lucide-react';

const UpdatteProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);

  const [input, setInput] = useState({
    fullName: user?.fullName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills?.map(skill => skill).join(", ") || ""

  })
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);  
    if (input.file) {
      formData.append("file", input.file);
    }
    setLoading(true);


    try {
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error response:", error.response?.data);

      toast.error(error.response.data.message);

    } finally{
      setLoading(false);
    }
    setOpen(false);

    console.log(input);

  }
  return (
    <div>
      <Dialog open={open}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className='grid py-4 gap-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='fullName' className='text-right'>Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={input.fullName}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='email' className='text-right'>Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='number' className='text-right'>Number</Label>
                <Input
                  id="number"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='bio' className='text-right'>Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='skills' className='text-right'>Skills</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='file' className='text-right'>Resume</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="col-span-3"
                />
              </div>

            </div>
            <DialogFooter>
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
                    Update
                  </Button>
                )
              }
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdatteProfileDialog
