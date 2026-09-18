const applicationModel = require("../models/application.model")
const jobModel = require("../models/job.model")
const userModel = require("../models/user.model")

const getAllUsersController = async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query

        let filter = {}

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

        const currentPage = Number(page)
        const usersLimit = Number(limit)
        const skip = (currentPage - 1) * usersLimit

        const totalUsers = await userModel.countDocuments(filter)

        const totalPages = Math.ceil(totalUsers / usersLimit)

        const users = await userModel
            .find(filter)
            .select("-password -refreshToken")
            .skip(skip)
            .limit(usersLimit)

        return res.status(200).json({
            message: "Users fetched successfully",
            users,
            pagination: {
                currentPage,
                totalPages,
                totalUsers,
                limit: usersLimit
            }
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "internal server error"
        })
    }
}
const getAllJobsController = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query

        const currentPage = Number(page)
        const jobsLimit = Number(limit)

        const skip = (currentPage - 1) * jobsLimit

        const totalJobs = await jobModel.countDocuments()

        const totalPages = Math.ceil(totalJobs / jobsLimit)

        const jobs = await jobModel
            .find()
            .populate("recruiter", "name email")
            .skip(skip)
            .limit(jobsLimit)

        return res.status(200).json({
            message: "Jobs fetched successfully",
            jobs,
            pagination: {
                currentPage,
                totalPages,
                totalJobs,
                limit: jobsLimit
            }
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "internal server error"
        })
    }
}
const getAllApplicationsController = async (req, res) => {
    try {
        const applications = await applicationModel
            .find()
            .populate("candidate", "name email")
            .populate("job", "title company")

        return res.status(200).json({
            message: "Applications fetched successfully",
            applications
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "internal server error"
        })
    }
}
module.exports = {
    getAllUsersController,
    getAllJobsController,
    getAllApplicationsController
}