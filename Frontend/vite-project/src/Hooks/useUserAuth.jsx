import React, { use, useCallback, useContext, useEffect } from 'react'
import { userContext } from '../Contexts/userContext'
import { useNavigate } from 'react-router-dom'

export const useUserAuth = () => {
const{user,loading,clearUser} = useContext(userContext)
const navigate = useNavigate();
useEffect(()=>{
    if(user) return;
    if(loading) return;
    if(!user){
        clearUser();
        navigate('/login');
    }
},[user,loading,clearUser,navigate]);
 
}
