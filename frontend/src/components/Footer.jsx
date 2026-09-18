import { Link } from "react-router"

const Footer = () => (
  <footer className="bg-[#173B57] text-white">
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <div>
          <div className="text-lg font-semibold">JobPortal</div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#b9c6d2]">
            A straightforward place to discover opportunities and connect with the right people.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 text-sm">
          <div>
            <p className="font-semibold">Explore</p>
            <div className="mt-4 space-y-3 text-[#b9c6d2]">
              <Link className="block hover:text-white" to="/jobs">Find jobs</Link>
              <Link className="block hover:text-white" to="/register">Create account</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold">For employers</p>
            <div className="mt-4 space-y-3 text-[#b9c6d2]">
              <Link className="block hover:text-white" to="/register">Post a job</Link>
              <span className="block">Build your team</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[#8fa1b1]">
        © 2026 JobPortal. All rights reserved.
      </div>
    </div>
  </footer>
)

export default Footer