import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../Components/Layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../Components/Cards/UserCard';
import toast from 'react-hot-toast';
const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUser = async () => {
    try {
      const response = await axiosInstance(API_PATHS.USERS.GET_ALL_USERS)
      setAllUsers(response.data)
    } catch (error) {
      console.log("Error fetching all users", error);
    }
  }
  const handleDownloadReport = async () => {
     try{
      const response = await axiosInstance(API_PATHS.REPORTS.EXPORT_USERS,{
        responseType: 'blob', 
      });
      // create a URL for the blob 
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url
      link.setAttribute("download","user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

     }catch(error){
      console.log("Error downloading user details", error);
      toast.error("Failed to download expense details .please try again later!");
     }
  }
  useEffect(() => {
    getAllUser();
  }, [allUsers])
  return (
    <DashboardLayout activeMenu={"Team Members"}>
    <div className='mt-5 mb-10'>
    <div className='flex md:flex-row md:items-center justify-between'>
    <h2 className='text-xl md:text-xl font-medium'>Team Member</h2>
    <button className='flex md:flex download-btn' onClick={handleDownloadReport}>
    <LuFileSpreadsheet className='text-lg'/>
    Download Report
    </button>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
    {allUsers.map((user)=>(
      <UserCard key={user._id} userInfo={user}/>
    ))}
    </div>
    </div>
    </DashboardLayout>
  )
}

export default ManageUsers