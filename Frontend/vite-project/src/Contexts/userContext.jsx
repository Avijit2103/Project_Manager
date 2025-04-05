import React, { createContext, useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';





export const userContext = createContext();
const UserProvider = ({ children }) => {
    const [user, SetUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) return;
        const accessToken = localStorage.getItem("token")
        if (!accessToken) {
            setLoading(fasle)
            return;
        }
        const fetchUser = () => {
            try {
                const response = axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
                SetUser(response.data)
            } catch (error) {
                console.error("user not authentication", error);
                clearUser();
            } finally {
                setLoading(false);
            }

        };
        fetchUser();
    }, [])
    const updateUser = (userData) => {
        SetUser(userData)
        localStorage.setItem("token", userData.token)//save token
        setLoading(false);
    }
    const clearUser = () => {
        SetUser(null)
        localStorage.removeItem("token")
    }
    return (
        <userContext.Provider value={{user,loading,updateUser,clearUser}}>
        {children}
        </userContext.Provider>
    )
}

export default UserProvider