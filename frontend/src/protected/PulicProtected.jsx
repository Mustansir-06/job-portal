import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'
import { store } from '../context/AuthContext'
import Loading from '../components/Loading'

const PulicProtected = () => {
    const {user,isLoading}=useContext(store)
    if (isLoading) return <Loading />
    if(user) return <Navigate to={"/main"}/>
    return <Outlet/>
}

export default PulicProtected
