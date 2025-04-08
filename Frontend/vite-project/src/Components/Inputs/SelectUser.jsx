import React, { useEffect,useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUser, LuUsers } from 'react-icons/lu';
import Modal from '../Modal';
import AvatarGroup from '../AvatarGroup';

const SelectUser = ({selectedUser,SetSelectedUser}) => {
    const [allUsers,setAllUsers] = useState([]);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [tempSelectedUser, setTempSelectedUser] = useState([]);

    const getAllUser = async()=>{
        try{
         const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
         if(response?.data?.length > 0 ){
            setAllUsers(response.data);
         }
        }catch(error){
           console.error("error fetching users",error);
        }
    }
    console.log(allUsers);
    
    const toggleUserSelection = (userId)=>{
        setTempSelectedUser((prev)=>
          prev.includes(userId)?prev.filter((id)=> id !== userId)
        :[...prev,userId]
        )
    }
    const handleAssign =()=>{
        SetSelectedUser(tempSelectedUser);
        setIsModalOpen(false);
    }
    const selectedUserAvatars = allUsers.
    filter((user) => selectedUser.includes(user._id)).
    map((user)=>user.profileImageUrl);
    useEffect(
        ()=>{getAllUser()}
    ,[])
    useEffect(()=>{
        if(selectedUser.length > 0){
            setTempSelectedUser([]);
            }
        return ()=>{};
    },[selectedUser])
  return (
    <div className='space-y-4 mt-2'>
    {selectedUserAvatars.length === 0 && (
        <button className='card-btn'  onClick={()=>setIsModalOpen(true)}>
        <LuUsers className='text-sm'/>Add Member</button>
    )}
    {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}
      
    <Modal
      isOpen={isModalOpen}
      onClose = {()=>setIsModalOpen(false)}
      title='Select User'
      >
      <div className="space-y-4 h-[60vh] overflow-y-auto">
      {allUsers.map((user) => (
        <div key={user._id} className="flex items-center gap-4 p-3 border-b border-gray-200">
          <img
            src={user.profileImageUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
            <p className="text-[13px] text-gray-500">{user.email}</p>
          </div>
          <input
            type="checkbox"
            checked={tempSelectedUser.includes(user._id)}
            onChange={() => toggleUserSelection(user._id)}
            className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 rounded-sm outline-none"
          />
        </div>
      ))}
    </div>
     <div className='flex justify-end gap-4 pt-4'>
     <buttton className='card-btn' onClick={()=>setIsModalOpen(false)}>
     CANCEL</buttton>
     <button className='card-btn-fill' onClick={handleAssign}>
     DONE</button>
     </div>
      </Modal>
     
    
    </div>
  )
}

export default SelectUser