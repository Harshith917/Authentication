import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true; // Allow cookies to be sent with requests

    // Backend URL from environment variables

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [isLoggedIn,setIsLoggedIn] = useState(false)

    const [userData,setUserData] = useState(false)


    const getAuthState = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
           toast.error(error.message)
        }
    }
    //when the app loads, check if the user is logged in
    useEffect(()=>{
        getAuthState();
    },[])
    

    const value ={
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData,
        getUserData
    }
    // You can add any state or functions you want to provide to the context here
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}