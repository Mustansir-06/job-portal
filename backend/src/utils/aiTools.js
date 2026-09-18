const mongoose = require("mongoose")

const jobModel = require("../models/job.model")
const applicationModel = require("../models/application.model")
const userModel = require("../models/user.model")


/*
========================================
JOB TOOLS
========================================
*/


const searchJobs = async ({
    search,
    company,
    location,
    employmentType,
    skills,
    minExperience,
    maxExperience,
    minSalary,
    maxSalary,
    status,
    sortBy,
    page = 1,
    limit = 10
}) => {

    try {

        let filter = {
            status: status || "active"
        }


        if (search) {

            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    company: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    skills: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        }


        if (company) {

            filter.company = {
                $regex: company.trim(),
                $options: "i"
            }
        }


        if (location) {

            const locations =
                location
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)

            if (locations.length > 0) {

                filter.location = {
                    $in: locations
                }
            }
        }


        if (employmentType) {

            const employmentTypes =
                employmentType
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)

            if (employmentTypes.length > 0) {

                filter.employmentType = {
                    $in: employmentTypes
                }
            }
        }


        if (skills && skills.length > 0) {

            const skillList =
                Array.isArray(skills)
                    ? skills
                    : skills
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)

            if (skillList.length > 0) {

                filter.skills = {
                    $all: skillList
                }
            }
        }


        if (
            minExperience !== undefined ||
            maxExperience !== undefined
        ) {

            filter.experience = {}

            if (minExperience !== undefined) {

                filter.experience.$gte =
                    Number(minExperience)
            }

            if (maxExperience !== undefined) {

                filter.experience.$lte =
                    Number(maxExperience)
            }
        }


        if (
            minSalary !== undefined ||
            maxSalary !== undefined
        ) {

            filter.salary = {}

            if (minSalary !== undefined) {

                filter.salary.$gte =
                    Number(minSalary)
            }

            if (maxSalary !== undefined) {

                filter.salary.$lte =
                    Number(maxSalary)
            }
        }


        if (status) {

            const statuses =
                status
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)

            if (statuses.length > 0) {

                filter.status = {
                    $in: statuses
                }
            }
        }


        let sort = {
            createdAt: -1
        }


        if (sortBy === "salaryHigh") {

            sort = {
                salary: -1
            }
        }


        if (sortBy === "salaryLow") {

            sort = {
                salary: 1
            }
        }


        if (sortBy === "newest") {

            sort = {
                createdAt: -1
            }
        }


        if (sortBy === "oldest") {

            sort = {
                createdAt: 1
            }
        }


        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )


        const jobsLimit =
            Math.min(
                Math.max(
                    Number(limit) || 10,
                    1
                ),
                10
            )


        const skip =
            (currentPage - 1) *
            jobsLimit


        const totalJobs =
            await jobModel.countDocuments(filter)


        const totalPages =
            Math.ceil(
                totalJobs / jobsLimit
            )


        const jobs =
            await jobModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(jobsLimit)
                .select(
                    "_id title description company location salary employmentType skills experience status recruiter createdAt"
                )


        return {
            jobs,
            pagination: {
                currentPage,
                totalPages,
                totalJobs,
                limit: jobsLimit
            }
        }

    } catch (error) {

        console.log(
            "searchJobs error:",
            error
        )

        throw error
    }
}


const getJobDetails = async (jobId) => {

    try {

        if (
            !mongoose.isValidObjectId(jobId)
        ) {

            return {
                job: null,
                message: "Invalid job id"
            }
        }


        const job =
            await jobModel
                .findOne({
                    _id: jobId,
                    status: "active"
                })
                .populate(
                    "recruiter",
                    "name email"
                )


        if (!job) {

            return {
                job: null,
                message: "Job not found"
            }
        }


        return {
            job
        }

    } catch (error) {

        console.log(
            "getJobDetails error:",
            error
        )

        throw error
    }
}


/*
========================================
CANDIDATE TOOLS
========================================
*/


const getMyApplications = async ({
    userId,
    status,
    page = 1,
    limit = 10
}) => {

    try {

        const filter = {
            candidate: userId
        }


        if (status) {

            filter.status = status
        }


        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )


        const applicationsLimit =
            Math.min(
                Math.max(
                    Number(limit) || 10,
                    1
                ),
                10
            )


        const skip =
            (currentPage - 1) *
            applicationsLimit


        const totalApplications =
            await applicationModel.countDocuments(
                filter
            )


        const totalPages =
            Math.ceil(
                totalApplications /
                applicationsLimit
            )


        const applications =
            await applicationModel
                .find(filter)
                .populate(
                    "job",
                    "title company location salary employmentType skills experience status"
                )
                .populate(
                    "recruiter",
                    "name email"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(applicationsLimit)


        return {
            applications,
            pagination: {
                currentPage,
                totalPages,
                totalApplications,
                limit: applicationsLimit
            }
        }

    } catch (error) {

        console.log(
            "getMyApplications error:",
            error
        )

        throw error
    }
}


const getMyProfile = async (userId) => {

    try {

        const user =
            await userModel
                .findById(userId)
                .select(
                    "name email role resume createdAt"
                )


        if (!user) {

            return {
                user: null,
                message: "User not found"
            }
        }


        return {
            user
        }

    } catch (error) {

        console.log(
            "getMyProfile error:",
            error
        )

        throw error
    }
}


/*
========================================
RECRUITER TOOLS
========================================
*/


const getMyJobs = async ({
    userId,
    status,
    page = 1,
    limit = 10
}) => {

    try {

        const filter = {
            recruiter: userId
        }


        if (status) {

            filter.status = status
        }


        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )


        const jobsLimit =
            Math.min(
                Math.max(
                    Number(limit) || 10,
                    1
                ),
                10
            )


        const skip =
            (currentPage - 1) *
            jobsLimit


        const totalJobs =
            await jobModel.countDocuments(
                filter
            )


        const totalPages =
            Math.ceil(
                totalJobs / jobsLimit
            )


        const jobs =
            await jobModel
                .find(filter)
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(jobsLimit)


        return {
            jobs,
            pagination: {
                currentPage,
                totalPages,
                totalJobs,
                limit: jobsLimit
            }
        }

    } catch (error) {

        console.log(
            "getMyJobs error:",
            error
        )

        throw error
    }
}


const getApplicantsForJob = async ({
    userId,
    jobId,
    status,
    page = 1,
    limit = 10
}) => {

    try {

        if (
            !mongoose.isValidObjectId(jobId)
        ) {

            return {
                applications: [],
                message: "Invalid job id"
            }
        }


        /*
        IMPORTANT:
        Check that this job belongs
        to the logged-in recruiter.
        */

        const job =
            await jobModel.findOne({
                _id: jobId,
                recruiter: userId
            })


        if (!job) {

            return {
                applications: [],
                message:
                    "Job not found or you do not own this job"
            }
        }


        const filter = {
            job: jobId
        }


        if (status) {

            filter.status = status
        }


        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )


        const applicationsLimit =
            Math.min(
                Math.max(
                    Number(limit) || 10,
                    1
                ),
                10
            )


        const skip =
            (currentPage - 1) *
            applicationsLimit


        const totalApplications =
            await applicationModel.countDocuments(
                filter
            )


        const totalPages =
            Math.ceil(
                totalApplications /
                applicationsLimit
            )


        const applications =
            await applicationModel
                .find(filter)
                .populate(
                    "candidate",
                    "name email resume"
                )
                .populate(
                    "job",
                    "title company location"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(applicationsLimit)


        return {
            applications,
            pagination: {
                currentPage,
                totalPages,
                totalApplications,
                limit: applicationsLimit
            }
        }

    } catch (error) {

        console.log(
            "getApplicantsForJob error:",
            error
        )

        throw error
    }
}


const getRecruiterStats = async (userId) => {

    try {

        const totalJobs =
            await jobModel.countDocuments({
                recruiter: userId
            })


        const activeJobs =
            await jobModel.countDocuments({
                recruiter: userId,
                status: "active"
            })


        const closedJobs =
            await jobModel.countDocuments({
                recruiter: userId,
                status: "closed"
            })


        const draftJobs =
            await jobModel.countDocuments({
                recruiter: userId,
                status: "draft"
            })


        const applications =
            await applicationModel.find({
                recruiter: userId
            })


        const totalApplications =
            applications.length


        const applicationStatusCounts =
            await applicationModel.aggregate([
                {
                    $match: {
                        recruiter:
                            new mongoose.Types.ObjectId(
                                userId
                            )
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])


        return {
            totalJobs,
            activeJobs,
            closedJobs,
            draftJobs,
            totalApplications,
            applicationStatusCounts:
                applicationStatusCounts.map(
                    (item) => ({
                        status: item._id,
                        count: item.count
                    })
                )
        }

    } catch (error) {

        console.log(
            "getRecruiterStats error:",
            error
        )

        throw error
    }
}


/*
========================================
ADMIN TOOLS
========================================
*/


const getPlatformStats = async () => {

    try {

        const totalUsers =
            await userModel.countDocuments()


        const totalCandidates =
            await userModel.countDocuments({
                role: "candidate"
            })


        const totalRecruiters =
            await userModel.countDocuments({
                role: "recruiter"
            })


        const totalJobs =
            await jobModel.countDocuments()


        const totalApplications =
            await applicationModel.countDocuments()


        const activeJobs =
            await jobModel.countDocuments({
                status: "active"
            })


        const closedJobs =
            await jobModel.countDocuments({
                status: "closed"
            })


        const draftJobs =
            await jobModel.countDocuments({
                status: "draft"
            })


        const applicationStatusCounts =
            await applicationModel.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])


        const jobStatusCounts =
            await jobModel.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])


        return {

            totalUsers,

            totalCandidates,

            totalRecruiters,

            totalJobs,

            activeJobs,

            closedJobs,

            draftJobs,

            totalApplications,

            applicationStatusCounts:
                applicationStatusCounts.map(
                    (item) => ({
                        status: item._id,
                        count: item.count
                    })
                ),

            jobStatusCounts:
                jobStatusCounts.map(
                    (item) => ({
                        status: item._id,
                        count: item.count
                    })
                )
        }

    } catch (error) {

        console.log(
            "getPlatformStats error:",
            error
        )

        throw error
    }
}


const getUsers = async ({
    search,
    role,
    page = 1,
    limit = 10
}) => {

    try {

        const filter = {}


        if (search) {

            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        }


        if (role) {

            filter.role = role
        }


        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )


        const usersLimit =
            Math.min(
                Math.max(
                    Number(limit) || 10,
                    1
                ),
                10
            )


        const skip =
            (currentPage - 1) *
            usersLimit


        const totalUsers =
            await userModel.countDocuments(
                filter
            )


        const totalPages =
            Math.ceil(
                totalUsers /
                usersLimit
            )


        const users =
            await userModel
                .find(filter)
                .select(
                    "-password -refreshToken"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(usersLimit)


        return {
            users,
            pagination: {
                currentPage,
                totalPages,
                totalUsers,
                limit: usersLimit
            }
        }

    } catch (error) {

        console.log(
            "getUsers error:",
            error
        )

        throw error
    }
}


const getAllJobs = async ({
    search,
    status,
    page = 1,
    limit = 10
}) => {

    try {

        const filter = {}


        if (search) {

            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    company: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    location: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        }


        if (status) {

            filter.status = status
        }


        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )


        const jobsLimit =
            Math.min(
                Math.max(
                    Number(limit) || 10,
                    1
                ),
                10
            )


        const skip =
            (currentPage - 1) *
            jobsLimit


        const totalJobs =
            await jobModel.countDocuments(
                filter
            )


        const totalPages =
            Math.ceil(
                totalJobs /
                jobsLimit
            )


        const jobs =
            await jobModel
                .find(filter)
                .populate(
                    "recruiter",
                    "name email"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(jobsLimit)


        return {
            jobs,
            pagination: {
                currentPage,
                totalPages,
                totalJobs,
                limit: jobsLimit
            }
        }

    } catch (error) {

        console.log(
            "getAllJobs error:",
            error
        )

        throw error
    }
}


const getAllApplications = async ({
    status,
    page = 1,
    limit = 10
}) => {

    try {

        const filter = {}


        if (status) {

            filter.status = status
        }


        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )


        const applicationsLimit =
            Math.min(
                Math.max(
                    Number(limit) || 10,
                    1
                ),
                10
            )


        const skip =
            (currentPage - 1) *
            applicationsLimit


        const totalApplications =
            await applicationModel.countDocuments(
                filter
            )


        const totalPages =
            Math.ceil(
                totalApplications /
                applicationsLimit
            )


        const applications =
            await applicationModel
                .find(filter)
                .populate(
                    "candidate",
                    "name email"
                )
                .populate(
                    "job",
                    "title company location"
                )
                .populate(
                    "recruiter",
                    "name email"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(applicationsLimit)


        return {
            applications,
            pagination: {
                currentPage,
                totalPages,
                totalApplications,
                limit: applicationsLimit
            }
        }

    } catch (error) {

        console.log(
            "getAllApplications error:",
            error
        )

        throw error
    }
}


module.exports = {

    // Job tools
    searchJobs,
    getJobDetails,

    // Candidate tools
    getMyApplications,
    getMyProfile,

    // Recruiter tools
    getMyJobs,
    getApplicantsForJob,
    getRecruiterStats,

    // Admin tools
    getPlatformStats,
    getUsers,
    getAllJobs,
    getAllApplications
}