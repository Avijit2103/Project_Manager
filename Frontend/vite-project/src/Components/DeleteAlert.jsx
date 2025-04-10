import React from 'react'

const DeleteAlert = ({content, onDelete}) => {
  return (
    <div className=''>
    <p className=''>{content}</p>
    <button className='' onClick={onDelete}>Delete</button>
    
    </div>
  )
}

export default DeleteAlert