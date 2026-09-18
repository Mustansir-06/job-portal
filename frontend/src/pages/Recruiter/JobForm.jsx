import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useApi } from "../../api/axios"

const Field = ({ label, children, wide = false }) => (
    <label className={wide ? "block sm:col-span-2" : "block"}>
        <span className="mb-2 block text-sm font-medium text-[#173b57]">
            {label}
        </span>

        {children}
    </label>
)

const input =
    "w-full border border-[#dfe4e9] bg-white px-3 py-3 outline-none focus:border-[#173b57]"

const JobForm = ({ button, edit }) => {
    const api = useApi()
    const navigate = useNavigate()
    const { id } = useParams()

    const [job, setJob] = useState(null)

    const [title, setTitle] = useState("")
    const [company, setCompany] = useState("")
    const [location, setLocation] = useState("")
    const [salary, setSalary] = useState("")
    const [employmentType, setEmploymentType] = useState("full-time")
    const [experience, setExperience] = useState("")
    const [skills, setSkills] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("active")

    const getJob = async () => {
        try {
            const res = await api.get(`/jobs/${id}`)

            const data = res.data.job

            setJob(data)
            setTitle(data.title)
            setCompany(data.company)
            setLocation(data.location)
            setSalary(data.salary)
            setEmploymentType(data.employmentType)
            setExperience(data.experience)
            setSkills(data.skills.join(", "))
            setDescription(data.description)
            setStatus(data.status)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (edit) {
            getJob()
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const jobData = {
            title,
            company,
            location,
            salary: Number(salary),
            employmentType,
            experience: Number(experience),
            skills: skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== ""),
            description,
            status
        }

        try {
            if (edit) {
                const res = await api.patch(`/jobs/${id}`, jobData)

                console.log(res)

                navigate(`/main/recruiter/jobs/${id}`)
            } else {
                const res = await api.post("/jobs", jobData)

                console.log(res)

                navigate("/main/recruiter/jobs")
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (edit && !job) {
        return (
            <p className="mt-8 text-sm text-[#687386]">
                Loading job...
            </p>
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8 border border-[#e2e6eb] bg-white p-6 lg:p-8"
        >
            <div className="grid gap-5 sm:grid-cols-2">

                <Field label="Job title" wide>
                    <input
                        className={input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Frontend Developer"
                        required
                    />
                </Field>

                <Field label="Company">
                    <input
                        className={input}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company name"
                        required
                    />
                </Field>

                <Field label="Location">
                    <input
                        className={input}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Pune, India"
                        required
                    />
                </Field>

                <Field label="Salary">
                    <input
                        className={input}
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="Annual salary"
                        required
                    />
                </Field>

                <Field label="Employment type">
                    <select
                        className={input}
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                    >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                    </select>
                </Field>

                <Field label="Experience">
                    <input
                        className={input}
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Years of experience"
                        required
                    />
                </Field>

                <Field label="Skills" wide>
                    <input
                        className={input}
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="React, JavaScript, Node.js"
                        required
                    />
                </Field>

                <Field label="Description" wide>
                    <textarea
                        className={`${input} min-h-44 resize-y`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the role, responsibilities and expectations..."
                        required
                    />
                </Field>

                <Field label="Status">
                    <select
                        className={input}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                    </select>
                </Field>

            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-[#e2e6eb] pt-6">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            edit
                                ? `/main/recruiter/jobs/${id}`
                                : "/main/recruiter/jobs"
                        )
                    }
                    className="border border-[#dfe4e9] px-5 py-2.5 text-sm"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="bg-[#173b57] px-6 py-2.5 text-sm font-semibold text-white"
                >
                    {button}
                </button>

            </div>
        </form>
    )
}

export default JobForm