import React, { useContext } from 'react'
import { useUserAuth } from '../../Hooks/useUserAuth'
import { userContext } from '../../Contexts/userContext';
import DashboardLayout from '../../Components/Layouts/DashboardLayout';

const Dashboard = () => {
  useUserAuth();

  const {user} = useContext(userContext);
  return (
    <DashboardLayout>Dashboard
    </DashboardLayout>
  )
}

export default Dashboard