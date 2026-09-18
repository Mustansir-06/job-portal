const applicationModel = require("../models/application.model")
const jobModel = require("../models/job.model")
const userModel = require("../models/user.model")

const uploadFile = require("../services/imagekit.service")

const createApplicationController = async (req, res) => {

    try {

        const { jobId } = req.params

        const job = await jobModel.findById(jobId)

        if (!job) {
            return res.status(404).json({
                message: "invalid job"
            })
        }

        const candidate = await userModel.findById(req.user.id)

        if (!candidate) {
            return res.status(404).json({
                message: "candidate not found"
            })
        }

        if (!candidate.resume) {
            return res.status(400).json({
                message: "please upload your resume before applying"
            })
        }

        const existingApplication = await applicationModel.findOne({
            candidate: req.user.id,
            job: job._id
        })

        if (existingApplication) {
            return res.status(400).json({
                message: "you have already applied for this job"
            })
        }

        const application = await applicationModel.create({

            job: job._id,

            candidate: req.user.id,

            recruiter: job.recruiter,

            resume: candidate.resume,

        })

        return res.status(201).json({

            message: "Application created successfully",

            application

        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({

            message: "internal server error"

        })
    }
}
const getAllApplicationController=async(req,res)=>{
    try {
        const applications=await applicationModel.find({candidate:req.user.id}).populate("job")
        return res.status(200).json({
            message:"Applications fetched successfully",
            applications
        })
    }catch(error) {
        return res.status(500).json({
            message:"internal server error"
        })
    }
}
const getbyIdApplicationController=async(req,res)=>{
    try {
        const {id}=req.params
        const application = await applicationModel.findOne({
        _id: id,
        candidate: req.user.id
        }).populate("job")
        if(!application){
            return res.status(404).json({
                message:"application not found"
            })
        }
        return res.status(200).json({
            message:"Application fetched successfully",
            application
        })
    }catch(error) {
        return res.status(500).json({
            message:"internal server error"
        })
    }
}
const withdrawApplicationController = async (req, res) => {
    try {
        const { id } = req.params

        const application = await applicationModel.findOne({
            _id: id,
            candidate: req.user.id
        })

        if (!application) {
            return res.status(404).json({
                message: "application not found"
            })
        }

        if (
            application.status === "selected" ||
            application.status === "rejected" ||
            application.status === "withdrawn"
        ) {
            return res.status(400).json({
                message: `cannot withdraw application with status ${application.status}`
            })
        }

        application.status = "withdrawn"
        await application.save()

        return res.status(200).json({
            message: "Application withdrawn successfully",
            application
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "internal server error"
        })
    }
}
const seeApplicantsController=async(req,res)=>{
    try {
        const {jobId}=req.params
        const job=await jobModel.findById(jobId)
        if(!job){
            return res.status(403).json({
                message:"invalid job"
            })
        }
        const applications = await applicationModel.find({
        recruiter: req.user.id,
        job: jobId
        }).populate("candidate", "name email")
            .populate("job", "title company")

        if (!applications) {
            return res.status(404).json({
                message: "application not found"
            })
        }
        return res.status(200).json({
            message:"Applicants Fetched Successfully",
            applications
        })


    }catch(error) {
        return res.status(500).json({
            message:"internal server error"
        })
    }
}
const updateApplicationStatusController=async(req,res)=>{
    try {
        const { id } = req.params
        const { status } = req.body
        const allowedStatuses = [
            "shortlisted",
            "interview",
            "selected",
            "rejected",
        ]

        if(!allowedStatuses.includes(status)){
            return res.status(400).json({
                message:"invalid status"
            })
        }
        const application = await applicationModel.findOne({
        _id: id,
        recruiter: req.user.id
        })
        if(!application){
            return res.status(404).json({
                message:"applications not found"
            })
        }
        
        application.status=status
        await application.save()
        await application.populate("candidate", "name email")
        await application.populate("job", "title company")
        return res.status(200).json({
            message:"Applicant status changed Successfully",
            application
        })

    }catch(error) {
        return res.status(500).json({
            message:"internal server error"
        })
    }
}
const isJobAppliedController=async(req,res)=>{
    try {
        const { jobId } = req.params
        const application = await applicationModel.findOne({
            candidate: req.user._id,
            job: jobId
        })
        return res.status(200).json({
            applied: !!application
        })

    }catch(error) {
        return res.status(500).json({
            message:"internal server error"
        })
    }
}

module.exports={
    createApplicationController,
    getAllApplicationController,
    getbyIdApplicationController,
    withdrawApplicationController,
    seeApplicantsController,
    updateApplicationStatusController,
    isJobAppliedController,
}