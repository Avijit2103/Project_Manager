import React from 'react'

const CustomLegends = ({payload}) => {
  return (
    <div className='flex flex-wrap justify-center gap-2 mt-4 space-x-6'>
    {
        payload.map((entry,index)=>(
            <div key={`legend-${index}`} className='flex items-center space-x-2'>
            <div className='h-2.5 w-2.5 rounded-full'
            style={{background:entry.color}}>
            </div>
            <span className='text-xs text-gray-700 font-medium'>
            {entry.value}
            </span>
            </div>
        ))
    }
    </div>
  )
}

export default CustomLegends