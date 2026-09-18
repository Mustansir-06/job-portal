const mongoose=require("mongoose")
const applicationModel = require("../models/application.model")
const jobModel = require("../models/job.model")
const userModel = require("../models/user.model")
const candidateDashboardController = async (req, res) => {
    try {

        const candidateId = new mongoose.Types.ObjectId(req.user.id)

        const result = await applicationModel.aggregate([
            {
                $match: {
                    candidate: candidateId
                }
            },
            {
                $facet: {
                    totalApplications: [
                        {
                            $count: "total"
                        }
                    ],

                    statusCounts: [
                        {
                            $group: {
                                _id: "$status",
                                count: {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            $project: {
                            _id: 0,
                            status: "$_id",
                            count: 1
                            }
                        },
                        {
                            $sort: {
                                count: -1
                            }
                        }
                    ],
                    selectedApplications: [
                        {
                         $match: {
                                status: "selected"
                            }
                        },
                        {
                            $count: "total"
                        }
                    ],
                    activeApplications: [
                        {
                            $match: {
                                status: {
                                    $in: ["applied", "shortlisted", "interview"]
                                }
                            }
                        },
                        {
                            $count: "total"
                        }
                    ]           
                }
            }
        ])

        const dashboard = result[0]
        const totalApplications =dashboard.totalApplications[0]?.total || 0
        const selectedApplications =dashboard.selectedApplications[0]?.total || 0
        const activeApplications =dashboard.activeApplications[0]?.total || 0

        return res.status(200).json({
            message: "Candidate dashboard fetched successfully",
            totalApplications,
            selectedApplications,
            activeApplications,
            statusCounts: dashboard.statusCounts
        })

    } catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
const recruiterDashboardController=async(req,res)=>{
    try {
        const recruiterId=new mongoose.Types.ObjectId(req.user.id)
        const result=await jobModel.aggregate([
            {
                $match:{
                    recruiter:recruiterId
                }
            },
            {
                $facet:{
                    totalJobs:[
                        {
                            $count:"total"
                        }
                    ],
                    statusCounts: [
                        {
                            $group: {
                                _id: "$status",
                                count: {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            $project: {
                            _id: 0,
                            status: "$_id",
                            count: 1
                            }
                        },
                        {
                            $sort: {
                                count: -1
                            }
                        }
                    ],
                    activeJobs: [
                        {
                         $match: {
                                status: "active"
                            }
                        },
                        {
                            $count: "total"
                        }
                    ],

                }
            },
            
        ])
        const dashboard = result[0]
        const totalJobs =dashboard.totalJobs[0]?.total || 0
        const activeJobs =dashboard.activeJobs[0]?.total || 0
        const totalApplications = await applicationModel.countDocuments({
            recruiter: recruiterId
        })
        const applicationStats = await applicationModel.aggregate([
            {
                $match: {
                    recruiter: recruiterId
                }
            },
            {
                $group: {
                _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1
                }
            },
            {
                $sort: {
                    count: -1
             }
            }
        ])
        return res.status(200).json({
            message: "Recruiter dashboard fetched successfully",
            totalJobs,
            activeJobs,
            totalApplications,
            jobStatusCounts: dashboard.statusCounts,
            applicationStatusCounts: applicationStats
        })
    } catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
const adminDashboardController = async(req,res) => {
    try {

        const totalUsers = await userModel.countDocuments()

        const totalCandidates = await userModel.countDocuments({
            role: "candidate"
        })

        const totalRecruiters = await userModel.countDocuments({
            role: "recruiter"
        })

        const totalJobs = await jobModel.countDocuments()

        const totalApplications = await applicationModel.countDocuments()

        return res.status(200).json({
            message: "Admin dashboard fetched successfully",
            totalUsers,
            totalCandidates,
            totalRecruiters,
            totalJobs,
            totalApplications
        })

    } catch(error) {

        return res.status(500).json({
            message: "internal server error"
        })
    }
}
module.exports={
    candidateDashboardController,
    recruiterDashboardController,
    adminDashboardController
}