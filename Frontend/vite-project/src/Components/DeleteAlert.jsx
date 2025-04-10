import React from 'react'

const DeleteAlert = ({content, onDelete}) => {
  return (
    <div className='text-sm'>
    <p className='mt-6'>{content}</p>
    <button
      className='ml-auto mt-2 flex items-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer'
      onClick={onDelete}
    >
      Delete
    </button>
  </div>
  
  )
}

export default DeleteAlert