import { useContext, useState } from "react"
import { store } from "../../context/AuthContext"
import { useApi } from "../../api/axios"

const CandidateProfile = () => {

    const { user, setUser } = useContext(store)
    const api = useApi()

    const [resume, setResume] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleResumeChange = (e) => {

        const file = e.target.files[0]

        if (!file) return

        setResume(file)
        setMessage("")
        setError("")
    }

    const handleSave = async () => {

        if (!resume) {
            setError("Please select a resume")
            return
        }

        try {

            setIsUploading(true)
            setMessage("")
            setError("")

            const formData = new FormData()

            formData.append("resume", resume)

            const res = await api.patch(
                "/auth/resume",
                formData
            )

            setUser(res.data.user)

            setResume(null)

            setMessage("Resume uploaded successfully")

        } catch (error) {

            console.log(error)

            setError(
                error.response?.data?.message ||
                "Unable to upload resume"
            )

        } finally {

            setIsUploading(false)

        }
    }

    return (
        <div className="mx-auto max-w-4xl">

            <p className="text-sm text-[#687386]">
                Account
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
                Your profile
            </h1>


            <div className="mt-8 border border-[#e2e6eb] bg-white p-7">


                {/* User information */}

                <div className="flex items-center gap-5 border-b border-[#e2e6eb] pb-7">

                    <div className="flex h-16 w-16 items-center justify-center bg-[#173b57] text-xl font-semibold text-white">

                        {user.name.charAt(0).toUpperCase()}

                    </div>

                    <div>

                        <h2 className="text-xl font-semibold text-[#173b57]">
                            {user.name}
                        </h2>

                        <p className="mt-1 text-sm text-[#687386]">
                            {user.role}
                        </p>

                    </div>

                </div>


                {/* Name and email */}

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                    <label>

                        <span className="mb-2 block text-sm font-medium">
                            Full name
                        </span>

                        <input
                            className="w-full border border-[#dfe4e9] px-3 py-3 outline-none"
                            value={user.name}
                            readOnly
                        />

                    </label>


                    <label>

                        <span className="mb-2 block text-sm font-medium">
                            Email
                        </span>

                        <input
                            className="w-full border border-[#dfe4e9] px-3 py-3 outline-none"
                            value={user.email}
                            readOnly
                        />

                    </label>

                </div>


                {/* Resume */}

                <div className="mt-6">

                    <span className="mb-2 block text-sm font-medium">
                        Resume
                    </span>


                    {user.resume && !resume ? (

                        <div className="border border-[#dfe4e9] bg-[#f8f9fa] p-5">

                            <div className="flex items-center justify-between gap-4">

                                <div>

                                    <p className="text-sm font-medium text-[#173b57]">
                                        Resume uploaded
                                    </p>

                                    <p className="mt-1 text-xs text-[#687386]">
                                        Your current resume is ready to use for applications.
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

                        </div>

                    ) : (

                        <label className="block cursor-pointer border border-dashed border-[#c7cdd5] p-7 text-center text-sm text-[#687386] hover:border-[#173b57]">

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleResumeChange}
                                className="hidden"
                            />

                            {resume ? (

                                <span className="font-medium text-[#173b57]">
                                    {resume.name}
                                </span>

                            ) : (

                                <>
                                    Drop your resume here or{" "}
                                    <span className="font-semibold text-[#c97b4b]">
                                        browse files
                                    </span>
                                </>

                            )}

                        </label>

                    )}

                </div>


                {/* Messages */}

                {error && (
                    <p className="mt-4 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="mt-4 text-sm text-green-600">
                        {message}
                    </p>
                )}


                {/* Save */}

                <button
                    onClick={handleSave}
                    disabled={isUploading || !resume}
                    className="mt-7 bg-[#173b57] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isUploading ? "Uploading..." : "Save changes"}
                </button>

            </div>

        </div>
    )
}

export default CandidateProfile