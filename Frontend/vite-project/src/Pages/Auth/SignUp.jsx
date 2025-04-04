import React, { useContext, useState } from 'react'
import AuthLayout from '../../Components/Layouts/AuthLayout'
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../Components/Inputs/ProfilePhotoSelector';
import Input from '../../Components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { userContext } from '../../Contexts/userContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("")
  const {updateUser} = useContext(userContext)
  const [error, setError] = useState(null)
  const navigate = useNavigate();
  //handle form submit
  const handleSignup = async (e) => {
    e.preventDefault(); 
    let profileImageUrl = ''
    if (!fullname) {
      setError("please enter full name ")
      return;
    }
    if (!validateEmail(email)) {
      setError("please enter a valid email address")
      return;
    }
    if (!password) {
      setError("please enter the password ")
      return;
    }
    setError("")
    //Signup  API call
    try{
      // upload image if present
      if(profilePic){
        const imgUploadImageRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadImageRes.imageUrl || '';
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:fullname,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
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
  }
  return (<AuthLayout>
    <div className='lg-w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center '>
      <h3 className='text-xl font-semibold text-black'>Create an account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        join us today by entering the the details below!
      </p>
      <form onSubmit={handleSignup}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            type="text"
            placeholder="your name"
            value={fullname}
            label="Full Name"
            onChange={(e) => setFullName(e.target.value)}
          />
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
          <Input
            value={adminInviteToken}
            onChange={(e) => setAdminInviteToken(e.target.value)}
            label="Admin Invite Token"
            placeholder="6 Digit Code"
            type="text"
          />
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>
          SIGN UP
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account?{" "}
          <Link className='font-medium text-primary underline' to='/login'>
          login
          </Link>
          </p>
       
      </form>
    </div>
  </AuthLayout>)

}

export default SignUp