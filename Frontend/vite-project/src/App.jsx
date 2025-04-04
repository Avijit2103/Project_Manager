import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
const App = () => {
  return (
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
            {/*Admin Route*/}
          <Route element={<PrivateRoutes allowedRole={['user']} />}>
          <Route path='/user/dashboard' element={<DashboardU/>} />
          <Route path='/users/tasks' element={<MyTasks/>} />
          <Route path='/users/task-details/:id' element={<TaskDetails/>} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App