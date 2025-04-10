import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../Components/Layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import toast from 'react-hot-toast';
import { LuTrash2 } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import SelectDropDown from '../../Components/Inputs/SelectDropDown';
import SelectUser from '../../Components/Inputs/SelectUser';
import ToDoInput from '../../Components/Inputs/ToDoInput';
import AddAttachmentsInput from '../../Components/Inputs/AddAttachmentsInput';
import moment from 'moment';
import Modal from '../../Components/Modal';
import DeleteAlert from '../../Components/DeleteAlert';
const CreateTasks = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });
  const [currentTask, setCurrentTask] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [openDeleteAlert, setOpenDeleteAlert] = useState();
  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };
  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    })
  }
  const CreateTask = async () => {
    setLoading(true);
    try{
       const todolist = taskData.todoChecklist?.map((item)=>({
        text:item,
        completed:false
       }))
       const repsonse = axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
        ...taskData,
        dueData: new Date(taskData.dueDate).toISOString(),
        todoChecklist:todolist,
       })
       toast.success("Task Created Succesfully")
       clearData();

    }catch(error){
       console.error("Error creating task",error)
       setLoading(false);
    }finally{
      setLoading(false);
    }
    
  }
  const updateTask = async () => {
      setLoading(true);
      try{
        const todolist = taskData.todoChecklist?.map((item)=>{
          const prevTodoChecklist = currentTask?.todoChecklist || [];
          const matchedTask = prevTodoChecklist.find((task)=> task.text== item);
          return{
            text:item,
            completed:matchedTask? matchedTask.completed:false,
          }
        })
        const response = axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TASK(taskId), {
            ...taskData,
            dueDate: new Date(taskData.dueDate).toISOString(),
            todoChecklist: todolist,
          });
          toast.success("Task Updated Succesfully!");
      }catch(error){
        console.error("Error updating task",error);
        setLoading(false);

      }finally{
        setLoading(false);
      }
  }
  const handleSubmit = async () => {
      setError(null);
      //input validation
      if(!taskData.title.trim()){
        setError("title feild is required");
        return;
      }
      if(!taskData.description.trim()){
        setError("description feild is required");
        return;
      }
      if(!taskData.dueDate){
        setError("due date is required");
        return;
      }
      if(!taskData.assignedTo?.length === 0){
        setError("you haven't assigned task to member");
        return;
      }
      if(!taskData.todoChecklist?.length === 0){
        setError("you haven't made any task ");
        return;
      }
      if(taskId){
        updateTask();
        return;
      }
      CreateTask();
  }
  const getTaskDetailsById = async () => {
     try{
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      if(response.data){
        const taskInfo = response.data;
        setCurrentTask(taskInfo);
        setTaskData((prevState)=>({
          title:taskInfo.title,
          description:taskInfo.description,
          priority:taskInfo.priority,
          dueDate:taskInfo.dueDate?moment(taskInfo.dueDate).format('YYYY-MM-DD'): null,
          assignedTo:taskInfo?.assignedTo?.map((item)=>item?._id) || [],
          todoChecklist:taskInfo?.todoChecklist?.map((item)=>item?.text) ||[],
          attachments:taskInfo?.attachments || []

        }))

      }
     }catch(error){
       console.error("Error fetching task",error)
     }
  }
  const deleteTask = async () => {
   try{
    await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
    setOpenDeleteAlert(false);
    toast.success("Task Deleted Succesfully");
    navigate('/admin/tasks')
   }catch(error){
    console.error("Error deleting task",
      error.response?.data?.message || error.message);
   }
  }
  useEffect(()=>{
    if(taskId){
      getTaskDetailsById(taskId);
    }
    return ()=>{}
    },[taskId])
  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>
                {taskId ? "Update Task" : " Create Task"}
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
                onChange={(e) =>
                  handleValueChange('title', e.target.value)
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
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
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
                  value={taskData.dueDate}
                  type='date'
                  onChange={({ target }) =>
                    handleValueChange('dueDate', target.value)
                  } />
              </div>
              <div className='col-span-12 md:col-span-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Assigned To
                </label>
                <SelectUser
                  selectedUser={taskData.assignedTo}
                  SetSelectedUser={(value) => {
                    handleValueChange('assignedTo', value)
                  }}
                />
              </div>

            </div>
            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                TODO Checklist</label>
              <ToDoInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange('todoChecklist', value)
                }
              />
            </div>
            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                ADD Attachments</label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange('attachments', value)
                }
              />
            </div>
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7"> 
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>

          </div>
        </div>
      </div>
     <Modal
      isOpen={openDeleteAlert}
      onClose = {()=>setOpenDeleteAlert(false)}
      title='Delete Task'
      >
      <DeleteAlert
       content='Are You sure you want to delete this task?'
       onDelete={()=> deleteTask()}
       />
      </Modal>
       
    </DashboardLayout>
  )
}

export default CreateTasks