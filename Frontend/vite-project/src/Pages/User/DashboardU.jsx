import React from 'react'
import { useUserAuth } from '../../Hooks/useUserAuth'

const DashboardU = () => {
  useUserAuth();
  return (
    <div>Dashboard</div>
  )
}

export default DashboardU