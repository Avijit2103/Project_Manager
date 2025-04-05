import React, { useContext, useState } from 'react'
import AuthLayout from '../../Components/Layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../Components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { userContext } from '../../Contexts/userContext'

const Login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState(null)
  const {updateUser} = useContext(userContext)
  const navigate = useNavigate()

  //handle form submit
  const handleLogin = async (e) => {
    e.preventDefault()
    if(!validateEmail(email)){
      setError("please enter a valid email address")
      return;
    }
    if(!password){
      setError("please enter the password ")
      return;
    }
    setError("")
    //Login API call
     try{
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
          email,
          password,
        });
        const {token,role} = response.data;
        if(token){
          localStorage.setItem("token",token);
          updateUser(response.data)
          if(role == 'admin'){
            navigate('/admin/dashboard')
          }else{
            navigate('/user/dashboard')
          }
        }
     }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("An error occurred")
      }
     }
  };
  return  <AuthLayout>
  <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
  <h3 className='text-xl font-semibold text-black'> Welcome Back!</h3>
  <p className='text-xs text-slate-700 mt-[5px] mb-6'>
  please enter your details
  </p>
  <form onSubmit={handleLogin}>
    <Input
     value={email}
     onChange={(e) => setEmail(e.target.value)}
     label="Email Address"
     placeholder="john@example.com"
     type="email"
     />
     <Input
     value={password}
     onChange={(e) => setPassword(e.target.value)}
     label="Password"
     placeholder="Min 8 Characters"
     type="password"
     />
     {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
     <button type='submit' className='btn-primary'>
     Login
     </button>
     <p className='text-[13px] text-slate-800 mt-3'>
     Don't have an account?{" "}
     <Link className='font-medium text-primary underline' to='/signup'>
     Signup
     </Link>
     </p>
  </form>
  </div>
  </AuthLayout>
  
}

export default Login