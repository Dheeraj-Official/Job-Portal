import React from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Bookmark } from 'lucide-react'
import { Badge } from '../ui/badge'; 
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const daysAgoFunction = (mongodbTime) => {
        const createdAT = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAT;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const navigate = useNavigate();

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 w-full max-w-full'>
            <div className='flex items-center justify-between flex-wrap sm:flex-nowrap'>
                <p className='text-sm sm:text-base'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <Button className="rounded-full mt-2 sm:mt-0" variant="outline" size="icon">
                    <Bookmark />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-4 flex-wrap sm:flex-nowrap'>
                <Button className="" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage className='w-full h-full' src={job?.company?.logo} alt="User avatar" />
                        <AvatarFallback>Logo</AvatarFallback>
                    </Avatar>
                </Button>
                <div className='text-sm sm:text-base'>
                    <h1 className='font-semibold'>{job?.company?.name}</h1>
                    <p className='text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg sm:text-xl my-6 sm:my-12'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>

            <div className='flex items-center flex-wrap gap-2 mt-4'>
                <Badge className='text-blue-700 font-bold' variant="ghost">{job?.position}</Badge>
                <Badge className='text-red-600 font-bold' variant="ghost">{job?.jobType}</Badge>
                <Badge className='text-purple-700 font-bold'>{job?.saraly}</Badge>
            </div>

            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className='w-full sm:w-auto'>Details</Button>
                <Button className="bg-[#7209b7] w-full sm:w-auto">Save for later</Button>
            </div>
        </div>
    )
}

export default Job
