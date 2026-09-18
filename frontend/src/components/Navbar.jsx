
import { Link, NavLink } from "react-router"
import { BriefcaseBusiness, Menu, X } from "lucide-react"
import { useContext, useState } from "react"
import { store } from "../context/AuthContext"

const Navbar = () => {
  const [open, setOpen] = useState(false)

  const { user } = useContext(store)

  const linkClass = ({ isActive }) =>
    `text-sm transition ${isActive ? "font-semibold text-[#173B57]" : "text-[#687386] hover:text-[#173B57]"}`

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e2e6eb] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-[#173B57] text-white">
            <BriefcaseBusiness size={18} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-[#173B57]">
            JobPortal
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/jobs" className={linkClass}>
            Find Jobs
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              to="/main"
              className="bg-[#173B57] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#102C43]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#173B57]"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="bg-[#173B57] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#102C43]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-[#173B57] md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#e2e6eb] bg-white px-4 py-5 sm:px-6 md:hidden">
          <div className="flex flex-col gap-5">

            <NavLink
              to="/jobs"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Find Jobs
            </NavLink>

            <div className="flex gap-3 border-t border-[#e2e6eb] pt-5">
              {user ? (
                <Link
                  to="/main"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-[#173B57] px-4 py-2 text-center text-sm text-white"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 border border-[#dfe4e9] px-4 py-2 text-center text-sm"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 bg-[#173B57] px-4 py-2 text-center text-sm text-white"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
