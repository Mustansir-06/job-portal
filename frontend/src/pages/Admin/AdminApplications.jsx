import { useEffect, useState } from "react"
import StatusBadge from "../../components/StatusBadge"
import { useApi } from "../../api/axios"

const AdminApplications = () => {
  const [applications, setApplications] = useState([])

  const api = useApi()

  const getApplications = async () => {
    try {
      const res = await api.get("/admin/applications")

      setApplications(res.data.applications)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getApplications()
  }, [])

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-[#687386]">
        Administration
      </p>

      <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
        Applications
      </h1>

      <div className="mt-8 overflow-x-auto border border-[#e2e6eb] bg-white">
        <div className="grid min-w-[700px] grid-cols-4 border-b border-[#e2e6eb] bg-[#f7f8fa] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#687386]">
          <span>Candidate</span>
          <span>Position</span>
          <span>Company</span>
          <span>Status</span>
        </div>

        {applications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#687386]">
              No applications found.
            </p>
          </div>
        ) : (
          applications.map((application) => (
            <div
              key={application._id}
              className="grid min-w-[700px] grid-cols-4 items-center border-b border-[#e2e6eb] px-5 py-5 text-sm last:border-b-0"
            >
              <span className="font-medium text-[#173b57]">
                {application.candidate.name}
              </span>

              <span className="text-[#687386]">
                {application.job.title}
              </span>

              <span className="text-[#687386]">
                {application.job.company}
              </span>

              <StatusBadge status={application.status} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminApplications