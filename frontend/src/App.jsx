
import { createBrowserRouter, RouterProvider } from "react-router"

import DashboardLayout from "./layouts/DashboardLayout"
import AuthLayout from "./layouts/AuthLayout"
import MainLayout from "./layouts/MainLayout"

import PublicProtected from "./protected/PulicProtected"
import MainProtected from "./Protected/MainProtected"
import RoleProtected from "./protected/RoleProtected"
import DashboardRedirect from "./protected/DashboardRedirect"

import Home from "./pages/Main/Home"
import Jobs from "./pages/Main/Jobs"
import JobDetails from "./pages/Main/JobDetails"

import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"

import CandidateDashboard from "./pages/Candidate/CandidateDashboard"
import MyApplications from "./pages/Candidate/MyApplications"
import ApplicationDetails from "./pages/Candidate/ApplicationDetails"
import CandidateProfile from "./pages/Candidate/CandidateProfile"

import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard"
import MyJobs from "./pages/Recruiter/MyJobs"
import CreateJob from "./pages/Recruiter/CreateJob"
import EditJob from "./pages/Recruiter/EditJob"
import RecruiterJobDetails from "./pages/Recruiter/RecruiterJobDetails"
import Applicants from "./pages/Recruiter/Applicants"

import AdminDashboard from "./pages/Admin/AdminDashboard"
import ManageUsers from "./pages/Admin/ManageUsers"
import ManageJobs from "./pages/Admin/ManageJobs"
import AdminApplications from "./pages/Admin/AdminApplications"
import ApplyJob from "./pages/Candidate/ApplyJob"
import Chat from "./pages/chat/Chat"


const App = () => {

    const router = createBrowserRouter([

        // Public pages
        {
            element: <MainLayout />,
            children: [
                {
                    path: "/",
                    element: <Home />
                },
                {
                    path: "jobs",
                    element: <Jobs />
                },
                {
                    path: "jobs/:id",
                    element: <JobDetails />
                }
            ]
        },


        // Authentication pages
        {
            element: <PublicProtected />,
            children: [
                {
                    element: <AuthLayout />,
                    children: [
                        {
                            path: "login",
                            element: <Login />
                        },
                        {
                            path: "register",
                            element: <Register />
                        }
                    ]
                }
            ]
        },


        // Protected dashboard
        {
            path: "/main",
            element: <MainProtected />,
            children: [
                {
                    element: <DashboardLayout />,
                    children: [

                        // /main
                        {
                            index: true,
                            element: <DashboardRedirect />
                        },
                        {
                            element: (
                                <RoleProtected allowedRoles={["candidate", "recruiter"]} />
                            ),
                            children: [
                                {
                                    path: "chat",
                                    element: <Chat />
                                }
                            ]
                        },


                        // Candidate routes
                        {
                            element: (
                                <RoleProtected allowedRoles={["candidate"]} />
                            ),
                            children: [
                                {
                                    path: "candidate/dashboard",
                                    element: <CandidateDashboard />
                                },
                                {
                                    path: "candidate/applications",
                                    element: <MyApplications />
                                },
                                {
                                    path: "candidate/profile",
                                    element: <CandidateProfile />
                                },
                                {
                                    path: "candidate/applications/:id",
                                    element: <ApplicationDetails />
                                },
                                {
                                    path: "jobs/:id/apply",
                                    element: <ApplyJob />
                                }
                            ]
                        },


                        // Recruiter routes
                        {
                            element: (
                                <RoleProtected allowedRoles={["recruiter"]} />
                            ),
                            children: [
                                {
                                    path: "recruiter/dashboard",
                                    element: <RecruiterDashboard />
                                },
                                {
                                    path: "recruiter/jobs",
                                    element: <MyJobs />
                                },
                                {
                                    path: "recruiter/jobs/create",
                                    element: <CreateJob />
                                },
                                {
                                    path: "recruiter/jobs/:id/edit",
                                    element: <EditJob />
                                },
                                {
                                    path: "recruiter/jobs/:id",
                                    element: <RecruiterJobDetails />
                                },
                                {
                                    path: "recruiter/jobs/:id/applicants",
                                    element: <Applicants />
                                }
                            ]
                        },


                        // Admin routes
                        {
                            element: (
                                <RoleProtected allowedRoles={["admin"]} />
                            ),
                            children: [
                                {
                                    path: "admin/dashboard",
                                    element: <AdminDashboard />
                                },
                                {
                                    path: "admin/users",
                                    element: <ManageUsers />
                                },
                                {
                                    path: "admin/jobs",
                                    element: <ManageJobs />
                                },
                                {
                                    path: "admin/applications",
                                    element: <AdminApplications />
                                }
                            ]
                        }

                    ]
                }
            ]
        }

    ])

    return <RouterProvider router={router} />
}

export default App

