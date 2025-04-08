import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../Hooks/useUserAuth'
import { userContext } from '../../Contexts/userContext';
import DashboardLayout from '../../Components/Layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment'
import InfoCard from '../../Components/Cards/InfoCard';
import { addThousandsSeparator } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../Components/TaskListTable';
import CustomPieChart from '../../Components/Charts/CustomPieChart';
import CustomBarChart from '../../Components/Charts/CustomBarChart';

const COLORS = ["#4E79A7","#59A14F","#F28E2B"];
const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(userContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const navigate = useNavigate();

  // prepare chart Data
  const prepareChartData = (Data) => {
    const taskdistribution = Data?.taskDistribution || null;
    const taskPriorityLevel = Data?.taskPriorityLevels || null;

    const taskDistrubutionData = [
      { status: "Pending", count: taskdistribution?.Pending || 0 },
      { status: "In Progress", count: taskdistribution?.InProgress || 0 },
      { status: "Completed", count: taskdistribution?.Completed || 0 },
    ]
    setPieChartData(taskDistrubutionData);
    const taskPriorityLevelData = [
      { priority: "Low", count: taskPriorityLevel?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevel?.Medium || 0 },
      { priority: "High", count: taskPriorityLevel?.High || 0 },
    ]
    setBarChartData(taskPriorityLevelData);


  }
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching data", error)
    }
  }
  useEffect(() => {
    console.log("Running useEffect, fetching dashboard data");
    getDashboardData();
    return () => { }
  }, [])
  const onSeeMore = () => {
    navigate('/admin/tasks')
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='card my-5'>
        <div>
          <div className='col-span-3'>
            <h2 className='text-xl md:text-2xl'>Welcome Back, {user?.name}!</h2>
            <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-[#3b82f6]"
          />

          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-red-500"
          />

          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-700"
          />

          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-green-500"
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
        <div >
          <div className='card'>
             <div className='flex items-center justify-between'>
               <h5 className='font-medium'>Task Distribution </h5>
             </div>
             <CustomPieChart
                data={pieChartData}
                colors={COLORS}
                />
          </div>
        </div>
        <div >
          <div className='card'>
             <div className='flex items-center justify-between'>
               <h5 className='font-medium'>Task Priorities </h5>
             </div>
             <CustomBarChart
                data={barChartData}
                />
          </div>
        </div>
        <div className='md:col-span-2'>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='text-lg'>Recent Tasks</h5>

              <button className='card-btn ' onClick={onSeeMore}>
                See All <LuArrowRight className='text-base' />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard