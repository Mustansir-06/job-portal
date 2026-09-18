import StatCard from "../../components/StatCard"
import StatusBadge from "../../components/StatusBadge"
import { useContext, useEffect, useState } from "react"
import { useApi } from "../../api/axios"
import { store } from "../../context/AuthContext"


const RecruiterDashboard = () => {
  const [dashboard, setDashboard] = useState(null)

  const api = useApi()
  const { user } = useContext(store)

  const getDashboard = async () => {
    try {
      const res = await api.get("/dashboard/recruiter")

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
    const item = dashboard?.applicationStatusCounts?.find(
      (item) => item.status === status
    )

    return item ? item.count : 0
  }

  const getJobStatusCount = (status) => {
    const item = dashboard?.jobStatusCounts?.find(
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

      <p className="text-sm text-[#687386]">
        Recruiter portal
      </p>

      <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
        {getGreeting()}, {user?.name}.
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        <StatCard
          label="Total jobs"
          value={dashboard.totalJobs}
          note="All postings"
        />

        <StatCard
          label="Active jobs"
          value={dashboard.activeJobs}
          note="Currently hiring"
        />

        <StatCard
          label="Applications"
          value={dashboard.totalApplications}
          note="Across your jobs"
        />

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <section className="border border-[#e2e6eb] bg-white p-6">

          <h2 className="font-semibold text-[#173b57]">
            Job status
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">

            {["active", "closed", "draft"].map((status) => {

              const count = getJobStatusCount(status)

              return (
                <div
                  key={status}
                  className="min-w-[120px] flex-1 border border-[#e2e6eb] p-4"
                >
                  <StatusBadge status={status} />

                  <p className="mt-3 text-2xl font-semibold text-[#173b57]">
                    {count}
                  </p>
                </div>
              )
            })}

          </div>

        </section>

        <section className="border border-[#e2e6eb] bg-white p-6">

          <h2 className="font-semibold text-[#173b57]">
            Application status
          </h2>

          <div className="mt-5 space-y-3">

            {[
              "applied",
              "shortlisted",
              "interview",
              "selected",
              "rejected"
            ].map((status) => {

              const count = getStatusCount(status)

              return (
                <div
                  key={status}
                  className="flex items-center justify-between border-b border-[#eef0f2] pb-3"
                >
                  <StatusBadge status={status} />

                  <span className="font-semibold text-[#173b57]">
                    {count}
                  </span>
                </div>
              )
            })}

          </div>

        </section>

      </div>

    </div>
  )
}

export default RecruiterDashboard