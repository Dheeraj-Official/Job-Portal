import React, { useEffect,useState } from 'react'
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import {Input} from '../ui/input';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '../../hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';

const Companies = () => {
  useGetAllCompanies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input,setInput] = useState("");
  
  
  return (
    <div>
      <Navbar/>
      <div className='max-w-6xl mx-auto my-10' >
        <div className='flex items-center justify-between'>
          <Input
            className="w-fit"
            placeholder="Filter by name"
            onChange = {(e)=>setInput(e.target.value)}
          />
          <Button onClick={()=> navigate("/admin/companies/create")} >New Company</Button>
        </div>
        <CompaniesTable search={input}/>
      </div>
    </div>
  )
}

export default Companies
