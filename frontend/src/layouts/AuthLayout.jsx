import { Outlet, Link } from "react-router"
import { BriefcaseBusiness } from "lucide-react"

const AuthLayout = () => (
  <div className="min-h-screen bg-[#f7f8fa]">
    <div className="mx-auto flex min-h-screen max-w-7xl">
      <div className="hidden w-1/2 bg-[#173b57] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-[#c97b4b]"><BriefcaseBusiness size={18} /></span>
          <span className="font-semibold">JobPortal</span>
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e0a57f]">Move forward</p>
          <h1 className="mt-5 max-w-lg text-3xl font-semibold leading-tight xl:text-5xl">Good opportunities start with the right place.</h1>
          <p className="mt-6 max-w-md leading-7 text-[#b9c6d2]">Find roles, manage applications, and build your next career step in one place.</p>
        </div>
        <p className="text-xs text-[#8fa1b1]">© 2026 JobPortal</p>
      </div>
      <main className="flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:w-1/2">{<Outlet />}</main>
    </div>
  </div>
)

export default AuthLayout