import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeft } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { useApi } from "../../api/axios"
import { store } from "../../context/AuthContext"

const ApplyJob = () => {

    const { id } = useParams()
    const api = useApi()
    const navigate = useNavigate()

    const { user } = useContext(store)

    const [job, setJob] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const getJob = async () => {

        try {

            const res = await api.get(`/jobs/${id}`)

            setJob(res.data.job)

        } catch (error) {

            console.log(error)
            setError("Unable to load job")

        } finally {

            setIsLoading(false)

        }
    }

    useEffect(() => {
        getJob()
    }, [id])


    const handleSubmit = async (e) => {

        e.preventDefault()

        setError("")
        setSuccess("")

        if (!user?.resume) {
            setError("Please upload your resume from your profile before applying")
            return
        }

        try {

            setIsSubmitting(true)

            await api.post(`/applications/${id}`)

            setSuccess("Application submitted successfully")

            setTimeout(() => {
                navigate(`/jobs/${id}`)
            }, 1000)

        } catch (error) {

            console.log(error)

            setError(
                error.response?.data?.message ||
                "Unable to submit application"
            )

        } finally {

            setIsSubmitting(false)

        }
    }


    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-[#687386]">
                    Loading...
                </p>
            </div>
        )
    }


    if (!job) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">

                    <h1 className="text-xl font-semibold text-[#173b57]">
                        Job not found
                    </h1>

                    <Link
                        to="/jobs"
                        className="mt-4 inline-block text-sm text-[#c97b4b] hover:underline"
                    >
                        Back to jobs
                    </Link>

                </div>
            </div>
        )
    }


    return (

        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">

            <Link
                to={`/jobs/${id}`}
                className="inline-flex items-center gap-2 text-sm text-[#687386] hover:text-[#173b57]"
            >
                <ArrowLeft size={15} />
                Back to job
            </Link>


            <div className="mt-8 border border-[#e2e6eb] bg-white p-7 lg:p-10">

                <div>

                    <p className="text-sm font-semibold uppercase tracking-wide text-[#687386]">
                        {job.company}
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#173b57]">
                        Apply for {job.title}
                    </h1>

                    <p className="mt-3 text-sm text-[#687386]">
                        Submit your application for this position.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="mt-8 border-t border-[#e2e6eb] pt-8"
                >

                    {/* Candidate */}

                    <div>

                        <label className="text-sm font-semibold text-[#173b57]">
                            Name
                        </label>

                        <input
                            type="text"
                            value={user?.name || ""}
                            disabled
                            className="mt-2 w-full border border-[#dfe4e9] bg-[#f5f6f7] px-4 py-3 text-sm text-[#687386] outline-none"
                        />

                    </div>


                    {/* Email */}

                    <div className="mt-5">

                        <label className="text-sm font-semibold text-[#173b57]">
                            Email
                        </label>

                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="mt-2 w-full border border-[#dfe4e9] bg-[#f5f6f7] px-4 py-3 text-sm text-[#687386] outline-none"
                        />

                    </div>


                    {/* Resume */}

                    <div className="mt-5">

                        <label className="text-sm font-semibold text-[#173b57]">
                            Resume
                        </label>

                        {user?.resume ? (

                            <div className="mt-2 flex items-center justify-between border border-[#dfe4e9] bg-[#f8f9fa] px-4 py-4">

                                <div>

                                    <p className="text-sm font-medium text-[#173b57]">
                                        Resume ready
                                    </p>

                                    <p className="mt-1 text-xs text-[#687386]">
                                        Your saved profile resume will be submitted with this application.
                                    </p>

                                </div>

                                <a
                                    href={user.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-semibold text-[#c97b4b] hover:underline"
                                >
                                    View resume
                                </a>

                            </div>

                        ) : (

                            <div className="mt-2 border border-[#dfe4e9] bg-[#f8f9fa] px-4 py-4">

                                <p className="text-sm text-[#687386]">
                                    No resume uploaded.
                                </p>

                                <Link
                                    to="/main/candidate/profile"
                                    className="mt-2 inline-block text-sm font-semibold text-[#c97b4b] hover:underline"
                                >
                                    Upload resume from profile
                                </Link>

                            </div>

                        )}

                    </div>


                    {/* Error */}

                    {error && (
                        <p className="mt-5 text-sm text-red-600">
                            {error}
                        </p>
                    )}


                    {/* Success */}

                    {success && (
                        <p className="mt-5 text-sm text-green-600">
                            {success}
                        </p>
                    )}


                    <button
                        type="submit"
                        disabled={isSubmitting || !user?.resume}
                        className="mt-7 w-full bg-[#c97b4b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b66b3d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? "Submitting..."
                            : "Submit application"}
                    </button>

                </form>

            </div>

        </div>
    )
}

export default ApplyJob