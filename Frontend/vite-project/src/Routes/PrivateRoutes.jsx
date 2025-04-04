import React from 'react'
import { Outlet } from 'react-router-dom'

const PrivateRoutes = ({allowedRole}) => {
  return <Outlet/>
}

export default PrivateRoutes