import React, { useState } from 'react'
import DashboardLayout from '../../Components/Layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import toast from 'react-hot-toast';
import { LuTrash2 } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import SelectDropDown from '../../Components/Inputs/SelectDropDown';
import SelectUser from '../../Components/Inputs/SelectUser';
const CreateTasks = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueData: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });
  const [currentTask, setCurrentTask] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [openDeleteAlert, setOpenDeleteAlert] = useState();
  const handleValueChange = (key, value) =>{ 
    setTaskData((prev) => ({ ...prev, [key]: value }));
};
  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueData: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    })
  }
  const CreateTask= async ()=>{
    const repsonse = axiosInstance.post(API_PATHS.TASKS.CREATE_TASK)
  } 
  const updateTask = async ()=>{

  }
  const handleSubmit = async()=>{

  }
  const getTaskDetailsById = async()=>{

  }
  const deleteTask = async()=>{

  }
  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5'>
       <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
        <div className='form-card col-span-3'>
          <div className='flex items-center justify-between'>
          <h2 className='text-xl md:text-xl font-medium'>
            {taskId ? "Update Task":" Create Task"}
          </h2>
          {taskId && (
            <button
             className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
             onClick={() => setOpenDeleteAlert(true)}
             >
             <LuTrash2 className='text-base'>Delete</LuTrash2>
             </button>
          )}
          </div>
          <div className='mt-4 '>
           <label className='text-xs font-medium text-slate-300'>
            Task Title
           </label>
           <input
            className='form-input'
            type="text"
            placeholder="create a  UI"
            value={taskData.title}
            onChange={(e)=>
              handleValueChange('title',e.target.value)
            }
            />
          </div>
          <div className='mt-3'>
           <label className='text-xs font-medium text-slate-600'>
             Description
           </label>
           <textarea
             placeholder='describe your task'
             className='form-input'
             rows={4}
             value={taskData.description}
             onChange={({target})=>
             handleValueChange("description",target.value)
            }
            />

          </div>
          <div className='grid grid-cols-12 gap-4 mt-2'>
           <div className='col-span-6 md:col-span-4'>
            <label className='text-xs font-medium text-slate-600'>
             Priority
            </label>
            <SelectDropDown
             options={PRIORITY_DATA}
             value={taskData.priority}
             onChange={(value) => handleValueChange('priority', value)}
             placeholder='select priority'
             />
           </div>
           <div className='col-span-6 md:col-span-4'>
           <label className='text-xs font-medium text-slate-600'>
           Due Date
           </label>
           <input
            placeholder='create a ui'
            className='form-input'
            value={taskData.dueData}
            type='date'
            onChange={({target})=>
            handleValueChange('dueDate',target.value)
          }/>
           </div>
           <div className='col-span-12 md:col-span-3'>
             <label className='text-xs font-medium text-slate-600'>
             Assigned To
             </label>
             <SelectUser
              selectedUser={taskData.assignedTo}
              SetSelectedUser={(value)=>{
                handleValueChange('assignedTo',value)
              }}
              />
           </div>

          </div>
          <div className='mt-3'>
           <label className='text-xs font-medium text-slate-600'>
           TODO Checklist</label>
           <ToDoInput
            todoList={taskData?.todoChecklist}
            setTodoList = {(value)=>
              handleValueChange('todoChecklist',value)
            }
            />
          </div>
        </div>
       </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateTasks