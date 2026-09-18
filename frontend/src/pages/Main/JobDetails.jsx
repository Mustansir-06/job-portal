import { Link, useNavigate, useParams } from "react-router"
import {
    ArrowLeft,
    MapPin,
    BriefcaseBusiness,
    IndianRupee,
    Clock3,
    Building2,
    MessageCircle
} from "lucide-react"
import { useApi } from "../../api/axios"
import { useContext, useEffect, useState } from "react"
import { store } from "../../context/AuthContext"

const JobDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const api = useApi()

    const { user } = useContext(store)

    const [details, setDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasApplied, setHasApplied] = useState(false)
    const [isCreatingConversation, setIsCreatingConversation] = useState(false)


    const getjobdetails = async () => {

        try {

            const res = await api.get(`/jobs/${id}`)

            setDetails(res.data.job)

        } catch (error) {

            console.log(error)

        } finally {

            setIsLoading(false)

        }
    }


    const checkApplication = async () => {

        try {

            const res = await api.get(`/applications/check/${id}`)

            setHasApplied(res.data.applied)

        } catch (error) {

            console.log(error)

        }
    }


    const startConversation = async () => {

        try {

            setIsCreatingConversation(true)

            await api.post(`/conversations/${id}`)

            navigate("/main/chat")

        } catch (error) {

            if (error.response?.status === 409) {

                // Conversation already exists.
                // Just open the chat.

                navigate("/main/chat")

            } else {

                console.log(error)

            }

        } finally {

            setIsCreatingConversation(false)

        }
    }


    useEffect(() => {
        getjobdetails()
    }, [id])


    useEffect(() => {

        if (user?.role === "candidate") {
            checkApplication()
        }

    }, [id, user])


    if (isLoading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <p className="text-sm text-[#687386]">
                    Loading job...
                </p>

            </div>
        )
    }


    if (!details) {

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

        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">

            <Link
                to="/jobs"
                className="inline-flex items-center gap-2 text-sm text-[#687386] hover:text-[#173b57]"
            >
                <ArrowLeft size={15} />
                Back to jobs
            </Link>


            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">


                {/* Main job details */}

                <article className="border border-[#e2e6eb] bg-white p-7 lg:p-10">


                    {/* Company */}

                    <div className="flex h-14 w-14 items-center justify-center bg-[#173b57] text-xl font-semibold text-white">
                        {details.company.charAt(0).toUpperCase()}
                    </div>


                    <p className="mt-7 text-sm font-semibold uppercase tracking-wide text-[#687386]">
                        {details.company}
                    </p>


                    {/* Job title */}

                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#173b57]">
                        {details.title}
                    </h1>


                    {/* Job information */}

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#687386]">

                        <span className="flex items-center gap-2">
                            <MapPin size={16} />
                            {details.location}
                        </span>


                        <span className="flex items-center gap-2">
                            <BriefcaseBusiness size={16} />
                            {details.employmentType}
                        </span>


                        <span className="flex items-center gap-2">
                            <IndianRupee size={16} />
                            ₹{details.salary.toLocaleString("en-IN")}
                        </span>

                    </div>


                    <div className="mt-10 border-t border-[#e2e6eb] pt-8">


                        {/* Description */}

                        <h2 className="text-xl font-semibold text-[#173b57]">
                            About the role
                        </h2>

                        <p className="mt-4 leading-8 text-[#687386]">
                            {details.description}
                        </p>


                        {/* What you'll work on */}

                        <h2 className="mt-10 text-xl font-semibold text-[#173b57]">
                            What you'll work on
                        </h2>

                        <ul className="mt-4 space-y-3 text-[#687386]">

                            <li>
                                • Build and maintain scalable web applications.
                            </li>

                            <li>
                                • Work with backend services and REST APIs.
                            </li>

                            <li>
                                • Improve application performance and usability.
                            </li>

                            <li>
                                • Collaborate with product and engineering teams.
                            </li>

                        </ul>


                        {/* Skills */}

                        <h2 className="mt-10 text-xl font-semibold text-[#173b57]">
                            Skills
                        </h2>


                        <div className="mt-4 flex flex-wrap gap-2">

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

                </article>



                {/* Right sidebar */}

                <aside className="h-fit border border-[#e2e6eb] bg-white p-6 lg:sticky lg:top-24">


                    <p className="text-sm text-[#687386]">
                        Interested in this role?
                    </p>


                    {/* Apply button */}

                    {!user ? (

                        <Link
                            to="/login"
                            className="mt-4 block bg-[#c97b4b] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#b66b3d]"
                        >
                            Apply now
                        </Link>

                    ) : user.role === "candidate" ? (

                        hasApplied ? (

                            <button
                                disabled
                                className="mt-4 block w-full cursor-not-allowed border border-[#dfe4e9] bg-[#f5f6f7] px-5 py-3 text-center text-sm font-semibold text-[#687386]"
                            >
                                Already applied
                            </button>

                        ) : (

                            <Link
                                to={`/main/jobs/${id}/apply`}
                                className="mt-4 block bg-[#c97b4b] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#b66b3d]"
                            >
                                Apply now
                            </Link>

                        )

                    ) : null}


                    {/* Message recruiter */}

                    {user?.role === "candidate" && (

                        <button
                            onClick={startConversation}
                            disabled={isCreatingConversation}
                            className="mt-3 flex w-full items-center justify-center gap-2 border border-[#173b57] px-5 py-3 text-sm font-semibold text-[#173b57] transition hover:bg-[#edf3f7] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <MessageCircle size={17} />

                            {isCreatingConversation
                                ? "Opening chat..."
                                : "Message recruiter"}

                        </button>

                    )}


                    <div className="mt-7 border-t border-[#e2e6eb] pt-6">


                        <p className="font-semibold text-[#173b57]">
                            Job overview
                        </p>


                        <div className="mt-5 space-y-4 text-sm text-[#687386]">


                            {/* Company */}

                            <p className="flex items-center gap-3">
                                <Building2 size={16} />
                                {details.company}
                            </p>


                            {/* Posted date */}

                            <p className="flex items-center gap-3">
                                <Clock3 size={16} />
                                Posted {new Date(details.createdAt).toLocaleDateString("en-IN")}
                            </p>


                            {/* Experience */}

                            <p className="flex items-center gap-3">
                                <BriefcaseBusiness size={16} />
                                {details.experience} year experience
                            </p>


                        </div>

                    </div>

                </aside>

            </div>

        </div>

    )
}

export default JobDetails