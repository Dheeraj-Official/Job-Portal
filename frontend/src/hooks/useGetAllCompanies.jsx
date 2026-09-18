import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import {COMPANY_API_END_POINT, } from  '../components/utils/constant'
import { useDispatch } from 'react-redux'
import { setAllJobs } from '../components/redux/jobSlice'
import { setCompanies } from '../components/redux/companySlice'


const useGetAllCompanies = () => {
    const dispatch = useDispatch();
  useEffect(() => {
    const fetchCompanies = async()=>{

        try {
            const res = await axios.get(`${COMPANY_API_END_POINT}/get`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if(res.data.success){
                dispatch(setCompanies(res.data.companies))
            }
        } catch (error) {
            console.log(error);
            
        }
    }
   fetchCompanies();  
  }, [])
  
}

export default useGetAllCompanies
