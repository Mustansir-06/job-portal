import { NavLink, Link, useNavigate } from "react-router"
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  Users,
  UserRound,
  PlusCircle,
  MessageCircle,
  LogOut,
  X
} from "lucide-react"
import api from "../api/axios"
import { useContext } from "react"
import { store } from "../context/AuthContext"

const DashboardSidebar = ({ role, open, onClose }) => {

  const navigate = useNavigate()

  const { setUser, setAccesstoken } = useContext(store)

  const handlelogout = async () => {
    try {
      await api.post("/auth/logout")

      setUser(null)
      setAccesstoken(null)

      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  const links = role === "candidate"
    ? [
        ["Dashboard", "/main/candidate/dashboard", LayoutDashboard],
        ["My applications", "/main/candidate/applications", FileText],
        ["Profile", "/main/candidate/profile", UserRound],
        ["Chat", "/main/chat", MessageCircle]
      ]
    : role === "recruiter"
    ? [
        ["Dashboard", "/main/recruiter/dashboard", LayoutDashboard],
        ["My jobs", "/main/recruiter/jobs", BriefcaseBusiness],
        ["Create job", "/main/recruiter/jobs/create", PlusCircle],
        ["Chat", "/main/chat", MessageCircle]
      ]
    : [
        ["Dashboard", "/main/admin/dashboard", LayoutDashboard],
        ["Users", "/main/admin/users", Users],
        ["Jobs", "/main/admin/jobs", BriefcaseBusiness],
        ["Applications", "/main/admin/applications", FileText]
      ]

  const content = (
    <div className="p-5">

      <div className="flex items-center justify-between lg:block">

        <p className="px-3 text-xs font-semibold uppercase tracking-widest text-[#9aa3b2]">
          {role} portal
        </p>

        <button
          onClick={onClose}
          className="lg:hidden text-[#687386]"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

      </div>

      <nav className="mt-4 space-y-1">

        {links.map(([label, path, Icon]) => (

          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm ${
                isActive
                  ? "bg-[#edf1f4] font-semibold text-[#173b57]"
                  : "text-[#687386] hover:bg-[#f7f8fa] hover:text-[#173b57]"
              }`
            }
          >

            <Icon size={17} />

            {label}

          </NavLink>

        ))}

      </nav>

      <div className="mt-10 border-t border-[#e2e6eb] pt-5">

        <Link
          onClick={onClose}
          to="/jobs"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#687386] hover:text-[#173b57]"
        >
          <BriefcaseBusiness size={17} />
          Browse jobs
        </Link>

        <button
          onClick={handlelogout}
          className="mt-1 flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#687386] hover:text-[#a24c4a]"
        >
          <LogOut size={17} />
          Sign out
        </button>

      </div>

    </div>
  )

  return (
    <>

      <aside className="hidden min-h-[calc(100vh-68px)] w-64 shrink-0 border-r border-[#e2e6eb] bg-white lg:block">

        <div className="sticky top-17">
          {content}
        </div>

      </aside>

      {open && (

        <div className="fixed inset-0 z-[60] lg:hidden">

          <button
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-[#173b57]/30"
          />

          <aside className="relative h-full w-[min(82vw,300px)] bg-white shadow-xl">
            {content}
          </aside>

        </div>

      )}

    </>
  )
}

export default DashboardSidebar