import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import {COMPANY_API_END_POINT, JOB_API_END_POINT} from  '../components/utils/constant'
import { useDispatch } from 'react-redux'
import { setAllJobs } from '../components/redux/jobSlice'
import { setSingleCompany } from '../components/redux/companySlice'


const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
  useEffect(() => {
    const fetchsingleCompany = async()=>{

        try {
            console.log("Getting company by ID:", companyId);
            const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if(res.data.success){
                dispatch(setSingleCompany(res.data.company))
            }
        } catch (error) {
            console.log(error);
            
        }
    }
   fetchsingleCompany();  
  }, [companyId,dispatch])
  
}

export default useGetCompanyById
