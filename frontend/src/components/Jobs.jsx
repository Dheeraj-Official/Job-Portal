import React, { useState, useEffect } from 'react'
import Job from './shared/Job'
import Navbar from './shared/Navbar';
import FilterCard from './shared/FilterCard';
import { useNavigate, Outlet } from 'react-router-dom';
import UpdatteProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';

const Jobs = () => {
  const navigate = useNavigate();
  const { allJobs, searchedQuery } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
      })
      setFilterJobs(filteredJobs)
    } else {
      setFilterJobs(allJobs)
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-5 px-4'>
        <div className='flex flex-col lg:flex-row gap-5'>
          {/* Filter Sidebar */}
          <div className='w-full lg:w-1/4'>
            <FilterCard />
          </div>

          {/* Job Listings */}
          {filterJobs.length <= 0 ? (
            <span className='text-center w-full mt-4'>Job not found</span>
          ) : (
            <div className='w-full lg:w-3/4 h-[80vh] overflow-y-auto pb-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                {filterJobs.map((job) => (
                  <div key={job?._id}>
                    <Job job={job} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default Jobs
