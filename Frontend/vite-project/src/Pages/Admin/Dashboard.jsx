import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../Hooks/useUserAuth'
import { userContext } from '../../Contexts/userContext';
import DashboardLayout from '../../Components/Layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Dashboard = () => {
  useUserAuth();

  const {user} = useContext(userContext);
  const [dashboardData, setDashboardData] = useState(null);
  const[pieChartData,setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const navigate = useNavigate();

  const getDashboardData = async()=>{
    try{
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if(response.data){
        setDashboardData(response.data);
      }
    }catch(error){
      console.error("Error fetching data",error)
    }
  }
  useEffect(()=>{
    console.log("Running useEffect, fetching dashboard data");
    getDashboardData();
    return ()=>{}
  },[])
  return (
    <DashboardLayout activeMenu="Dashboard">
      
    </DashboardLayout>
  )
}

export default Dashboard