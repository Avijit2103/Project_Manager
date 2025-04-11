import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom'
import Login from './Pages/Auth/Login'
import SignUp from './Pages/Auth/SignUp'
import Dashboard from './Pages/Admin/Dashboard'
import ManageTasks from './Pages/Admin/ManageTasks'
import CreateTasks from './Pages/Admin/CreateTasks'
import ManageUsers from './Pages/Admin/ManageUsers'
import DashboardU from './Pages/User/DashboardU'
import MyTasks from './Pages/User/MyTasks'
import TaskDetails from './Pages/User/TaskDetails'
import PrivateRoutes from './Routes/PrivateRoutes'
import UserProvider from './Contexts/userContext'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          {/*Admin Route*/}
          <Route element={<PrivateRoutes allowedRole={['admin']} />}>
            <Route path='/admin/dashboard' element={<Dashboard />} />
            <Route path='/admin/tasks' element={<ManageTasks/>} />
            <Route path='/admin/create-task' element={<CreateTasks/>} />
            <Route path='/admin/users' element={<ManageUsers/>} />
            </Route>
            {/*User Route*/}
          <Route element={<PrivateRoutes allowedRole={['user']} />}>
          <Route path='/user/dashboard' element={<DashboardU/>} />
          <Route path='/user/tasks' element={<MyTasks/>} />
          <Route path='/users/task-details/:id' element={<TaskDetails/>} />
          </Route>
          {/*Default Route*/ }
          <Route path='/' element={<Root />} />
        </Routes>
      </Router>
    </div>
    <Toaster
      toastOptions={{
        className:'',
        style:{
          fontSize:"13px"
        },

      }}
      />
    </UserProvider>
  )
}

export default App

const Root =()=>{
   const {user,loading} = useContext(UserProvider)
   if(loading) return <Outlet/>
   if(!user){
    return <Navigate to='/login'/>
   }
   return user.role=='admin'?(<Navigate to='/admin/dashboard'/>)
   :(<Navigate to='/user/dashboard'/>)
};