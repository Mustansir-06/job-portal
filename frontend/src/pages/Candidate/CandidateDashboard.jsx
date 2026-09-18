import { NavLink } from "react-router"
import StatCard from "../../components/StatCard"
import StatusBadge from "../../components/StatusBadge"
import { useContext, useEffect, useState } from "react"
import { useApi } from "../../api/axios"
import { store} from "../../context/AuthContext"

const CandidateDashboard = () => {
  const [dashboard, setDashboard] = useState(null)

  const api = useApi()
  const { user } = useContext(store)

  const getDashboard = async () => {
    try {
      const res = await api.get("/dashboard/candidate")

      setDashboard(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDashboard()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      return "Good morning"
    }

    if (hour >= 12 && hour < 17) {
      return "Good afternoon"
    }

    if (hour >= 17 && hour < 21) {
      return "Good evening"
    }

    return "Good night"
  }

  const getStatusCount = (status) => {
    const item = dashboard?.statusCounts?.find(
      (item) => item.status === status
    )

    return item ? item.count : 0
  }

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

      <div>
        <p className="text-sm text-[#687386]">
          {getGreeting()}, {user?.name}
        </p>

        <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
          Candidate dashboard
        </h1>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        <StatCard
          label="Total applications"
          value={dashboard.totalApplications}
          note="Across all positions"
        />

        <StatCard
          label="Active applications"
          value={dashboard.activeApplications}
          note="Currently in progress"
        />

        <StatCard
          label="Selected"
          value={dashboard.selectedApplications}
          note="Congratulations"
        />

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">

        <section className="border border-[#e2e6eb] bg-white p-6">

          <h2 className="font-semibold text-[#173b57]">
            Application status
          </h2>

          <div className="mt-6 space-y-5">

            {[
              "applied",
              "shortlisted",
              "interview",
              "selected",
              "rejected"
            ].map((status) => {

              const count = getStatusCount(status)

              const percentage =
                dashboard.totalApplications === 0
                  ? 0
                  : (count / dashboard.totalApplications) * 100

              return (
                <div key={status}>

                  <div className="flex justify-between text-sm">

                    <StatusBadge status={status} />

                    <span className="font-semibold text-[#173b57]">
                      {count}
                    </span>

                  </div>

                  <div className="mt-2 h-2 bg-[#edf0f2]">

                    <div
                      className="h-2 bg-[#c97b4b]"
                      style={{
                        width: `${percentage}%`
                      }}
                    />

                  </div>

                </div>
              )
            })}

          </div>

        </section>

        <section className="border border-[#e2e6eb] bg-white p-6">

          <h2 className="font-semibold text-[#173b57]">
            Quick actions
          </h2>

          <div className="mt-5 space-y-3">

            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `block border p-4 text-sm text-[#173b57] hover:border-[#c97b4b] ${
                  isActive
                    ? "border-[#c97b4b]"
                    : "border-[#dfe4e9]"
                }`
              }
            >
              Browse new jobs →
            </NavLink>

            <NavLink
              to="/main/candidate/applications"
              className={({ isActive }) =>
                `block border p-4 text-sm text-[#173b57] hover:border-[#c97b4b] ${
                  isActive
                    ? "border-[#c97b4b]"
                    : "border-[#dfe4e9]"
                }`
              }
            >
              View applications →
            </NavLink>

            <NavLink
              to="/main/candidate/profile"
              className={({ isActive }) =>
                `block border p-4 text-sm text-[#173b57] hover:border-[#c97b4b] ${
                  isActive
                    ? "border-[#c97b4b]"
                    : "border-[#dfe4e9]"
                }`
              }
            >
              Update profile →
            </NavLink>

          </div>

        </section>

      </div>

    </div>
  )
}

export default CandidateDashboard