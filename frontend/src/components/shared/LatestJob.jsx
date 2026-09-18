import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const randomJobs = [1,2,3,4,5,6,7,8];
const LatestJob = () => {
  const {allJobs} = useSelector(store=>store.job);
  const navigate = useNavigate();
  return (
    <div className='max-w-7xl mx-auto my-20'>
      <h1 className='text-4xl font-bold' ><span className='text-[#6a3bc2]'>Latest & Top </span> Job Opening</h1>
      <div className='grid grid-cols-3 gap-4 my-5'>
            {
              allJobs.length <=0? <span>No job available </span> : allJobs.slice(0,6).map((job)=> <LatestJobCards onClick={()=> navigate(`/description/${job._id}`)} key={job._id} job={job}/>)
            }
      </div>

    </div>
  )
}

export default LatestJob
