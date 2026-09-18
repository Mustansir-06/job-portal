import { useParams } from "react-router"
import { useApi } from "../../api/axios"
import StatusBadge from "../../components/StatusBadge"
import { useEffect, useState } from "react"

const Applicants = () => {
    const [applicants, setApplicants] = useState([])
    const api = useApi()
    const { id } = useParams()

    const getdetails = async () => {
        try {
            const res = await api.get(`/applications/job/${id}`)
            setApplicants(res.data.applications)
        } catch (error) {
            console.log(error)
        }
    }

    const changeStatus = async (applicationId, status) => {
        try {
            const res = await api.patch(
                `/applications/${applicationId}/status`,
                { status }
            )

            setApplicants((prev) =>
                prev.map((application) =>
                    application._id === applicationId
                        ? res.data.application
                        : application
                )
            )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getdetails()
    }, [])

    return (
        <div className="mx-auto max-w-6xl">
            <p className="text-sm text-[#687386]">
                {applicants[0]?.job?.title} · {applicants[0]?.job?.company}
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
                Applicants
            </h1>

            <p className="mt-2 text-sm text-[#687386]">
                {applicants.length} applications for this position.
            </p>

            <div className="mt-8 border border-[#e2e6eb] bg-white">
                {applicants.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-[#687386]">
                            No applications for this job yet.
                        </p>
                    </div>
                ) : (
                    applicants.map((application) => (
                        <div
                            key={application._id}
                            className="flex flex-col gap-4 border-b border-[#e2e6eb] p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-semibold text-[#173b57]">
                                    {application.candidate.name}
                                </p>

                                <p className="mt-1 text-sm text-[#687386]">
                                    {application.candidate.email}
                                </p>

                                <a
                                    href={application.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-block text-sm font-semibold text-[#c97b4b]"
                                >
                                    View resume
                                </a>
                            </div>

                            <div className="flex items-center gap-4">
                                <StatusBadge status={application.status} />

                                <select
                                    className="border border-[#dfe4e9] bg-white px-3 py-2 text-sm"
                                    value={application.status}
                                    onChange={(e) =>
                                        changeStatus(
                                            application._id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="applied">
                                        applied
                                    </option>

                                    <option value="shortlisted">
                                        shortlisted
                                    </option>

                                    <option value="interview">
                                        interview
                                    </option>

                                    <option value="selected">
                                        selected
                                    </option>

                                    <option value="rejected">
                                        rejected
                                    </option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Applicants