import { useEffect, useState } from "react"
import StatusBadge from "../../components/StatusBadge"
import { useApi } from "../../api/axios"

const ManageJobs = () => {
  const [jobs, setJobs] = useState([])

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  })

  const api = useApi()
  const removeJob = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to remove this job?"
  )

  if (!confirmDelete) return

  try {
    await api.delete(`/jobs/${id}`)

    setJobs((prev) =>
      prev.filter((job) => job._id !== id)
    )
  } catch (error) {
    console.log(error)
  }
}
  const getJobs = async () => {
    try {
      const res = await api.get(
        `/admin/jobs?page=${pagination.currentPage}&limit=10`
      )

      setJobs(res.data.jobs)
      setPagination(res.data.pagination)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getJobs()
  }, [pagination.currentPage])

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-[#687386]">
        Administration
      </p>

      <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
        Manage jobs
      </h1>

      <div className="mt-8 border border-[#e2e6eb] bg-white">
        {jobs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#687386]">
              No jobs found.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="flex flex-col gap-4 border-b border-[#e2e6eb] p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-[#173b57]">
                  {job.title}
                </p>

                <p className="mt-1 text-sm text-[#687386]">
                  {job.company} · {job.location}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <StatusBadge status={job.status} />

                <button
                  onClick={() => removeJob(job._id)}
                  className="text-sm text-[#a24c4a]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-[#687386]">
          {pagination.totalJobs} jobs
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1
              }))
            }
            className="border border-[#dfe4e9] px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-3 py-2 text-sm text-[#687386]">
            {pagination.currentPage} / {pagination.totalPages}
          </span>

          <button
            disabled={
              pagination.currentPage === pagination.totalPages
            }
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1
              }))
            }
            className="border border-[#dfe4e9] px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageJobs