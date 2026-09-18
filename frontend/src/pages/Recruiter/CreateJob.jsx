import JobForm from "./JobForm"

const CreateJob = () => (
    <div className="mx-auto max-w-4xl">
        <p className="text-sm text-[#687386]">
            Recruiter portal
        </p>

        <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
            Create a job
        </h1>

        <p className="mt-3 text-sm text-[#687386]">
            Add the details candidates will see when they discover your opening.
        </p>

        <JobForm button="Publish job" />
    </div>
)

export default CreateJob