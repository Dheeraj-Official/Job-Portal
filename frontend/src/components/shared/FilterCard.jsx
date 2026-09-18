import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '../ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Banglore", "Hyderabad", "Noida", "Gurugram"]
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullSack", "Data scientist", "Electrican"]
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42k-1lakh", "1lakh-5lakh"]
  }
]

const FilterCard = () => {
  const [selectedValue, setSelectedVaue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedVaue(value);
  }

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div className="w-full sm:w-auto p-4 sm:p-6 bg-white rounded-md shadow-md">
      <h1 className='font-bold text-xl sm:text-2xl'>Filter Jobs</h1>
      <hr className='mt-3 mb-4' />
      <RadioGroup value={selectedValue} onValueChange={changeHandler} className="space-y-4">
        {
          filterData.map((data, index) => (
            <div key={index}>
              <h1 className='font-semibold text-lg sm:text-xl mb-2'>{data.filterType}</h1>
              {
                data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`
                  return (
                    <div key={itemId} className='flex items-center space-x-2 my-2'>
                      <RadioGroupItem value={item} id={itemId} />
                      <Label htmlFor={itemId} className="text-sm sm:text-base">{item}</Label>
                    </div>
                  )
                })
              }
            </div>
          ))
        }
      </RadioGroup>
    </div>
  )
}

export default FilterCard
