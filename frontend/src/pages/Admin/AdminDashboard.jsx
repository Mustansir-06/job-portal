import StatCard from "../../components/StatCard"
import { useEffect, useState } from "react"
import { useApi } from "../../api/axios"

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null)

  const api = useApi()

  const getDashboard = async () => {
    try {
      const res = await api.get("/dashboard/admin")

      setDashboard(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDashboard()
  }, [])

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-[#687386]">
          Loading dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">

      <p className="text-sm text-[#687386]">
        Platform overview
      </p>

      <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
        Admin dashboard
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          label="Total users"
          value={dashboard.totalUsers}
        />

        <StatCard
          label="Candidates"
          value={dashboard.totalCandidates}
        />

        <StatCard
          label="Recruiters"
          value={dashboard.totalRecruiters}
        />

        <StatCard
          label="Jobs"
          value={dashboard.totalJobs}
        />

        <StatCard
          label="Applications"
          value={dashboard.totalApplications}
        />

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <section className="border border-[#e2e6eb] bg-white p-6">

          <h2 className="font-semibold text-[#173b57]">
            Platform activity
          </h2>

          <div className="mt-6 flex h-56 items-end gap-3 border-b border-l border-[#e2e6eb] px-5 pb-0">

            {[40, 58, 45, 72, 64, 88, 76, 95, 83, 100, 90, 110].map(
              (h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#173b57]"
                  style={{
                    height: `${h}%`
                  }}
                />
              )
            )}

          </div>

          <div className="mt-3 flex justify-between text-xs text-[#9aa3b2]">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>

        </section>

        <section className="border border-[#e2e6eb] bg-white p-6">

          <h2 className="font-semibold text-[#173b57]">
            Quick management
          </h2>

          <div className="mt-5 space-y-3">

            <a
              href="/admin/users"
              className="block border border-[#dfe4e9] p-4 text-sm text-[#173b57]"
            >
              Manage users →
            </a>

            <a
              href="/admin/jobs"
              className="block border border-[#dfe4e9] p-4 text-sm text-[#173b57]"
            >
              Review jobs →
            </a>

            <a
              href="/admin/applications"
              className="block border border-[#dfe4e9] p-4 text-sm text-[#173b57]"
            >
              View applications →
            </a>

          </div>

        </section>

      </div>

    </div>
  )
}

export default AdminDashboard