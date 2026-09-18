import { Link } from "react-router"
import StatusBadge from "../../components/StatusBadge"
import { useEffect, useState } from "react"
import { useApi } from "../../api/axios"

const MyApplications = () => {
    const [applications, setApplications] = useState([])
    const api = useApi()

    const getmyapplications = async () => {
        try {
            const res = await api.get("/applications/my")
            setApplications(res.data.applications)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getmyapplications()
    }, [])

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-sm text-[#687386]">Candidate portal</p>
                    <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
                        My applications
                    </h1>
                </div>

                <Link
                    to="/jobs"
                    className="bg-[#173b57] px-5 py-2.5 text-sm font-semibold text-white"
                >
                    Find jobs
                </Link>
            </div>

            <div className="mt-8 border border-[#e2e6eb] bg-white">
                {applications.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-[#687386]">
                            You haven't applied to any jobs yet.
                        </p>

                        <Link
                            to="/jobs"
                            className="mt-4 inline-block text-sm font-semibold text-[#c97b4b] hover:underline"
                        >
                            Find jobs
                        </Link>
                    </div>
                ) : (
                    applications.map((application) => (
                        <Link
                            to={`/main/candidate/applications/${application._id}`}
                            key={application._id}
                            className="flex flex-col gap-4 border-b border-[#e2e6eb] p-5 last:border-b-0 hover:bg-[#fafbfc] sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-semibold text-[#173b57]">
                                    {application.job.title}
                                </p>

                                <p className="mt-1 text-sm text-[#687386]">
                                    {application.job.company} ·{" "}
                                    {application.job.location}
                                </p>
                            </div>

                            <StatusBadge status={application.status} />
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyApplications