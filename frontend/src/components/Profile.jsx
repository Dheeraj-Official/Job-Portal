import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useState } from 'react'
import { Pen, Mail, Contact } from 'lucide-react'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import { Label } from '@radix-ui/react-label'
import AppliedJobTable from './shared/AppliedJobTable'
import { useSelector } from 'react-redux'
import { Badge } from '@/components/ui/badge';

import UpdateProfileDialog from './UpdateProfileDialog'
import useGetAppliedJobs from '../hooks/useGetAppliedJobs'


const skills = ["Html", "Css", "javascript", "reactjs"]




const Profile = () => {
    console.log("✅ useGetAppliedJobs hook is running");
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const isResume = true;


    return (
        <div>
            <Navbar />
            <div className='max-w-5xl mx-auto my-5 p-8 border border-gray-200 shadow-2xl'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className='h-[100px] w-[100px] overflow-hidden rounded-full'>
                            <AvatarImage className=" h-full w-full object-cover" src='https://cdn.pixabay.com/photo/2024/05/11/13/32/portrait-8754958_1280.jpg' />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullName}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={()=>setOpen(true)} className="text-right" variant="outline"><Pen  /></Button>

                </div>
                <div>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber }</span>
                    </div>
                </div>
                <div>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-2 my-3'>
                        {
                            user?.profile?.skills.length != 0 ? user?.profile?.skills.map((item, index) => (
                                <Badge key={index}>{item}</Badge>
                            )) : <span>N/A</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-2 '>
                    <Label className='text-md font-bold'>Resume</Label>
                    {
                        isResume ? <a href={user?.profile?.resume} rel="noopener noreferrer" className="text-blue-600 underline" target="_blank">{user?.profile?.resumeOriginalName}</a>
                            : <span>N/A</span>
                    }
                </div>

            </div>
            <div className='max-w-5xl mx-auto bg-white rounded-2xl py-5 px-5'>
                <h1>Applied Jobs</h1>
               
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen = {setOpen} />
        </div>
    )
}

export default Profile
