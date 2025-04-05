import React, { useContext } from 'react'
import { useUserAuth } from '../../Hooks/useUserAuth'
import { userContext } from '../../Contexts/userContext';

const Dashboard = () => {
  useUserAuth();

  const {user} = useContext(userContext);
  return (
    <div>Dashboard
    </div>
  )
}

export default Dashboard