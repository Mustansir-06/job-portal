import { useContext } from "react"
import { Navigate } from "react-router"
import { store } from "../context/AuthContext"

const DashboardRedirect = () => {

    const { user } = useContext(store)

    if (user.role === "candidate") {
        return <Navigate to="/main/candidate/dashboard" replace />
    }

    if (user.role === "recruiter") {
        return <Navigate to="/main/recruiter/dashboard" replace />
    }

    if (user.role === "admin") {
        return <Navigate to="/main/admin/dashboard" replace />
    }

    return <Navigate to="/" replace />
}

export default DashboardRedirect