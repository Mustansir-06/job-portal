import { Link } from "react-router"
import StatusBadge from "../../components/StatusBadge"
import { useEffect, useState } from "react"
import { useApi } from "../../api/axios"

const MyJobs = () => {
  const [jobs, setJobs] = useState([])
  const api = useApi()

  const getjobs = async () => {
    try {
      const res = await api.get("/jobs/my")
      setJobs(res.data.jobs)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/jobs/${id}`)

      setJobs((prev) => prev.filter((job) => job._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getjobs()
  }, [])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-[#687386]">Recruiter portal</p>

          <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
            My jobs
          </h1>
        </div>

        <Link
          to="/main/recruiter/jobs/create"
          className="bg-[#173b57] px-5 py-2.5 text-center text-sm font-semibold text-white"
        >
          + Create job
        </Link>
      </div>

      <div className="mt-8 border border-[#e2e6eb] bg-white">
        {jobs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#687386]">
              You haven't created any jobs yet.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="flex flex-col gap-4 border-b border-[#e2e6eb] p-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <Link
                  to={`/main/recruiter/jobs/${job._id}`}
                  className="font-semibold text-[#173b57] hover:text-[#c97b4b]"
                >
                  {job.title}
                </Link>

                <p className="mt-1 text-sm text-[#687386]">
                  {job.company} · {job.location}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <StatusBadge status={job.status} />

                <Link
                  to={`/main/recruiter/jobs/${job._id}/edit`}
                  className="text-sm font-semibold text-[#173b57]"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="text-sm font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyJobs