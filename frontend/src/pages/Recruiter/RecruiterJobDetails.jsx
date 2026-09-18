import { Link, useParams } from "react-router"
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  BriefcaseBusiness
} from "lucide-react"
import StatusBadge from "../../components/StatusBadge"
import { useEffect, useState } from "react"
import { useApi } from "../../api/axios"

const RecruiterJobDetails = () => {
  const [details, setDetails] = useState()
  const api = useApi()
  const { id } = useParams()

  const getdetails = async () => {
    try {
      const res = await api.get(`/jobs/${id}`)
      setDetails(res.data.job)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getdetails()
  }, [])

  if (!details) {
    return (
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-[#687386]">
          Loading job details...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/main/recruiter/jobs"
        className="inline-flex items-center gap-2 text-sm text-[#687386]"
      >
        <ArrowLeft size={15} />
        Back to jobs
      </Link>

      <div className="mt-7 border border-[#e2e6eb] bg-white p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex h-12 w-12 items-center justify-center bg-[#173b57] text-lg font-semibold text-white">
              {details.company.charAt(0)}
            </div>

            <p className="mt-5 text-sm text-[#687386]">
              {details.company}
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
              {details.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#687386]">
              <span>
                <MapPin size={15} className="mr-1 inline" />
                {details.location}
              </span>

              <span>
                <IndianRupee size={15} className="mr-1 inline" />
                {details.salary.toLocaleString("en-IN")}
              </span>

              <span>
                <BriefcaseBusiness size={15} className="mr-1 inline" />
                {details.employmentType}
              </span>
            </div>
          </div>

          <StatusBadge status={details.status} />
        </div>

        <div className="mt-8 border-t border-[#e2e6eb] pt-7">
          <h2 className="font-semibold text-[#173b57]">
            Job description
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#687386]">
            {details.description}
          </p>
        </div>

        <div className="mt-7">
          <h2 className="font-semibold text-[#173b57]">
            Experience
          </h2>

          <p className="mt-2 text-sm text-[#687386]">
            {details.experience} year
            {details.experience !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="mt-7">
          <h2 className="font-semibold text-[#173b57]">
            Skills
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {details.skills.map((skill) => (
              <span
                key={skill}
                className="border border-[#dfe4e9] px-3 py-1.5 text-sm text-[#687386]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Link
          to={`/main/recruiter/jobs/${id}/edit`}
          className="border border-[#dfe4e9] px-5 py-2.5 text-sm font-medium"
        >
          Edit job
        </Link>

        <Link
          to={`/main/recruiter/jobs/${id}/applicants`}
          className="bg-[#173b57] px-5 py-2.5 text-sm font-semibold text-white"
        >
          View applicants
        </Link>
      </div>
    </div>
  )
}

export default RecruiterJobDetails