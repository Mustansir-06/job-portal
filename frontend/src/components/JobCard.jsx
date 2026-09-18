import { Link } from "react-router"
import { MapPin, BriefcaseBusiness, IndianRupee } from "lucide-react"

const JobCard = ({ job }) => {
  return <Link
    to={`/jobs/${job._id}`}
    className="group block border border-[#e2e6eb] bg-white p-6 transition hover:-translate-y-1 hover:border-[#c97b4b] hover:shadow-sm"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#eef1f4] font-semibold text-[#173b57]">
        {job.company[0]}
      </div>
      <span className="bg-[#f2f4f6] px-2.5 py-1 text-xs text-[#687386]">{job.type}</span>
    </div>
    <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#687386]">{job.company}</p>
    <h3 className="mt-1 text-lg font-semibold text-[#173b57]">{job.title}</h3>
    <div className="mt-4 space-y-2 text-sm text-[#687386]">
      <p className="flex items-center gap-2"><MapPin size={15} />{job.location}</p>
      <p className="flex items-center gap-2"><IndianRupee size={15} />{job.salary}</p>
      <p className="flex items-center gap-2"><BriefcaseBusiness size={15} />{job.experience}</p>
    </div>
    <div className="mt-6 border-t border-[#e2e6eb] pt-5 text-sm font-semibold text-[#c97b4b]">
      View position →
    </div>
  </Link>
}

export default JobCard