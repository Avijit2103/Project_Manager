import React, { useState } from 'react'
import { LuChevronsDown } from 'react-icons/lu'
const SelectDropDown = ({options,value,onChange,placeholder}) => {
    const [isOpen,setIsOpen] = useState(false);
    const handleSelect= (option)=>{
      onChange(option);
      setIsOpen(false);

    }
  return <div className='relative w-full'>
  {/* Dropdown button */}
  <button 
    onClick={() => setIsOpen(!isOpen)}
    className='w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md md-2 flex justify-between items-center'
  >
    {value ? options.find((opt) => opt.value === value)?.label : placeholder}
    <span className='ml-2'>
      {isOpen ? <LuChevronsDown className='rotate-180' /> : <LuChevronsDown />}
    </span>
  </button>

  {/* Dropdown menu */}
  {isOpen && (
    <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className='px-3 py-2 text-sm cursor-pointer hover:bg-gray-100'
        >
          {option.label}
        </div>
      ))}
    </div>
  )}
</div>

  
}

export default SelectDropDown