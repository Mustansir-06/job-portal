import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'
import { store } from '../context/AuthContext'
import Loading from '../components/Loading'

const MainProtected = () => {
    const {user,isLoading}=useContext(store)
    if (isLoading) return <Loading />
    if(!user) return <Navigate to={"/"}/>
    return <Outlet/>
}

export default MainProtected
