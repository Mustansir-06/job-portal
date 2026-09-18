import JobForm from "./JobForm"

const EditJob = () => (
    <div className="mx-auto max-w-4xl">
        <p className="text-sm text-[#687386]">Recruiter portal</p>

        <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
            Edit job
        </h1>

        <JobForm button="Save changes" edit />
    </div>
)

export default EditJob