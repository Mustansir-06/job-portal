import { Link, useParams } from "react-router"
import { ArrowLeft, FileText } from "lucide-react"
import StatusBadge from "../../components/StatusBadge"
import { useApi } from "../../api/axios"
import { useEffect, useState } from "react"

const ApplicationDetails = () => {
    const api = useApi()
    const { id } = useParams()
    const [application, setApplication] = useState(null)
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const withdrawApplication = async () => {
        try {
            setIsWithdrawing(true)

            const response = await api.patch(`/applications/${id}/withdraw`)

            setApplication(response.data.application)
        } catch (error) {
            console.log(error)
        } finally {
            setIsWithdrawing(false)
        }
    }

    const getdetails = async () => {
        try {
            const response = await api.get(`/applications/${id}`)
            setApplication(response.data.application)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getdetails()
    }, [])

    if (!application) {
        return (
            <div className="mx-auto max-w-4xl">
                <p className="text-sm text-[#687386]">
                    Loading application...
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl">
            <Link
                to="/main/candidate/applications"
                className="inline-flex items-center gap-2 text-sm text-[#687386]"
            >
                <ArrowLeft size={15} />
                Back to applications
            </Link>

            <div className="mt-7 border border-[#e2e6eb] bg-white p-7 lg:p-9">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-sm text-[#687386]">
                            {application.job.company}
                        </p>

                        <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
                            {application.job.title}
                        </h1>

                        <p className="mt-2 text-sm text-[#687386]">
                            {application.job.location} ·{" "}
                            {application.job.employmentType}
                        </p>
                    </div>

                    <StatusBadge status={application.status} />
                </div>

                <div className="mt-9 grid gap-4 sm:grid-cols-3">
                    <div className="bg-[#f7f8fa] p-4">
                        <p className="text-xs text-[#687386]">
                            Applied
                        </p>

                        <p className="mt-1 font-medium text-[#173b57]">
                            {new Date(application.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }
                            )}
                        </p>
                    </div>

                    <div className="bg-[#f7f8fa] p-4">
                        <p className="text-xs text-[#687386]">
                            Current stage
                        </p>

                        <p className="mt-1 font-medium capitalize text-[#173b57]">
                            {application.status}
                        </p>
                    </div>

                    <div className="bg-[#f7f8fa] p-4">
                        <p className="text-xs text-[#687386]">
                            Location
                        </p>

                        <p className="mt-1 font-medium text-[#173b57]">
                            {application.job.location}
                        </p>
                    </div>
                </div>

                <div className="mt-8 border-t border-[#e2e6eb] pt-7">
                    <p className="font-semibold text-[#173b57]">
                        Submitted resume
                    </p>

                    <div className="mt-4 flex items-center justify-between border border-[#dfe4e9] p-4">
                        <span className="flex items-center gap-3 text-sm text-[#687386]">
                            <FileText size={18} />
                            Submitted resume
                        </span>

                        <a
                            href={application.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-[#c97b4b] hover:underline"
                        >
                            Open
                        </a>
                    </div>
                </div>

                  {application.status !== "selected" &&
                      application.status !== "rejected" &&
                      application.status !== "withdrawn" && (
                          <button
                              onClick={withdrawApplication}
                              disabled={isWithdrawing}
                              className="mt-8 border border-[#d9b1ae] px-5 py-2.5 text-sm font-medium text-[#a24c4a] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                              {isWithdrawing
                                  ? "Withdrawing..."
                                  : "Withdraw application"}
                          </button>
                      )}
            </div>
        </div>
    )
}

export default ApplicationDetails