import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'
import { store } from '../context/AuthContext'

const RoleProtected = ({allowedRoles}) => {
  const {user}=useContext(store)
  if(!allowedRoles.includes(user.role)) return <Navigate to={"/main"}/>
  return <Outlet/>
}

export default RoleProtected
