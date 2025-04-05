import React, { useState } from 'react'

const Navbar = ({activeMenu}) => {
  const [openSideMenu,setOpenSideMenu] = useState()
  return (
    <div className=''>
    <button
    className=''
    onClick={()=>{
        setOpenSideMenu(!openSideMenu);
    }}
    >
    { openSideMenu?(
        <HiOutlinex className=''/>
    ):(
        <HiOutlineMenu className=''/>
    )};
    </button>
    
    </div>
     

  )
}

export default Navbar