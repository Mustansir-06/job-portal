import { Outlet } from "react-router"
import { useContext, useState } from "react"
import { Menu } from "lucide-react"
import Navbar from "../components/Navbar"
import DashboardSidebar from "../components/DashboardSidebar"
import { store } from "../context/AuthContext"
import AIAssistant from "../components/AIAssistant/AIAssistant"

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {user}=useContext(store)
  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-68px)] bg-[#f7f8fa]">
        <DashboardSidebar role={user.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mb-5 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="inline-flex items-center gap-2 border border-[#dfe4e9] bg-white px-3 py-2 text-sm font-medium text-[#173b57]">
              <Menu size={17} /> Menu
            </button>
          </div>
          <Outlet />
        </main>
      </div>
      <AIAssistant />
    </>
  )
}

export default DashboardLayout