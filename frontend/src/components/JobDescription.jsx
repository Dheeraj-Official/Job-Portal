import React, { useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from 'react-redux';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from './utils/constant';
import { useParams } from 'react-router-dom';
import { setSingleJob } from "@/components/redux/jobSlice"; // or correct path based on location
import { Toaster } from 'sonner'
import { useState } from 'react';


const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch();
  const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant == user?._id) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied)
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { 
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
       });
      console.log("response data", res.data)
      if (res.data.success) {
        setIsApplied(true)// update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user?._id }]
        };

        dispatch(setSingleJob(updatedSingleJob));// helps us to real time ui update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }


  useEffect(() => {
    const fetchSingleJob = async () => {
      try {

        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job))
          setIsApplied(res.data.job.applications.some(application => application.applicant == user?._id))
        }

      } catch (error) {
        console.log(error);

      }
    }
    fetchSingleJob();
  }, [jobId, dispatch, user?._id])
  return (
    <div className='max-w-7xl mx-auto my-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
          <div className='flex items-center gap-2 mt-4'>
            <Badge className='text-blue-700 font-bold' variant="default">{singleJob?.position}</Badge>
            <Badge className='text-red-600 font-bold' variant="secondary">{singleJob?.jobType}</Badge>
            <Badge className='text-purple-700 font-bold' variant="outline">{singleJob?.salary}</Badge>

          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#63387ed1]'}`}>
          {isApplied ? 'Already Applied' : 'Apply Now'}
        </Button>
      </div>
      <h1 className='border-b-2 border-b-gray-300 font-medium py-4'> Job Description</h1>
      <div>
        <h1 className='font-bold my-1 '>Role<span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
        <h1 className='font-bold my-1 '>Location<span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
        <h1 className='font-bold my-1 '>Description<span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
        <h1 className='font-bold my-1 '>Experience<span className='pl-4 font-normal text-gray-800'>{singleJob?.experience}</span></h1>
        <h1 className='font-bold my-1 '>Salary<span className='pl-4 font-normal text-gray-800'> {singleJob?.salary}</span></h1>
        <h1 className='font-bold my-1 '>Total Applicants<span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
        <h1 className='font-bold my-1 '>Posted Date<span className='pl-4 font-normal text-gray-800'> {singleJob?.createdAt?.split("T")[0]} </span></h1>
      </div>
    </div>
  )
}

export default JobDescription
