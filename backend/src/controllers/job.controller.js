const jobModel = require("../models/job.model")

const createJobController =async(req,res)=>{
    try{
    const {title,description,company,location,salary,employmentType,skills,experience}=req.body
    if(!title || !description || !company  || !location || salary === undefined || !employmentType || !skills || experience === undefined){
        return res.status(400).json({
            message:"all fields are required"
        })
    }
    const job=await jobModel.create({
        title,
        description,
        company,
        location,
        salary,
        employmentType,
        skills,
        experience,
        recruiter:req.user.id
    })
    return res.status(201).json({
        message:"job created successfully",
        job
    })
    }catch(error) {

        return res.status(500).json({
            message:"internal server error"
        })
    }
}
const getJobsController=async(req,res)=>{
    try{
    const {search,location,employmentType,skills,minExperience,maxExperience,minSalary,maxSalary,status,sortBy}=req.query
    let filter={}
    if(search){
       filter.$or=[
                {title: {$regex:search , $options:"i"}},
                { description: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { skills: { $regex: search, $options: "i" } }
            ]
        
    }
    if(location){
        const locations = location.split(",").map(item => item.trim())
        filter.location = {
            $in: locations
        }
    }

    if(employmentType){
        const emptypes = employmentType.split(",").map(item => item.trim())
        filter.employmentType = {
            $in: emptypes
        }
    }

    if(skills){
        const skill = skills.split(",").map(item => item.trim())
        filter.skills = {
            $all: skill
        }
    }

    if(status){
        const stat = status.split(",").map(item => item.trim())
        filter.status = {
            $in: stat
        }
    }
    if(minExperience || maxExperience){
        filter.experience = {}
        if(minExperience){
            filter.experience.$gte = Number(minExperience)
        }
        if(maxExperience){
            filter.experience.$lte = Number(maxExperience)
        }
    }
    if(minSalary || maxSalary){
        filter.salary = {}
        if(minSalary){
            filter.salary.$gte = Number(minSalary)
        }
        if(maxSalary){
            filter.salary.$lte = Number(maxSalary)
        }
    }
    let sort = {
        createdAt: -1
    }
    if(sortBy === "salaryHigh"){
        sort = { salary: -1 }
    }

    if(sortBy === "salaryLow"){
        sort = { salary: 1 }
    }

    if(sortBy === "newest"){
        sort = { createdAt: -1 }
    }

    if(sortBy === "oldest"){
        sort = { createdAt: 1 }
    }   
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    const totalJobs = await jobModel.countDocuments(filter)
    const totalPages = Math.ceil(totalJobs / limit)
    const alljobs=await jobModel.find(filter).sort(sort).skip(skip).limit(limit)
    return res.status(200).json({
        message:"fetched all jobs successfully",
        alljobs,
        pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        limit,
        }
    })
    } catch(error) {

        return res.status(500).json({
            message:"internal server error"
        })
    }  
}
const getJobsbyIdController=async(req,res)=>{
    try{
    const {id}=req.params
    const job=await jobModel.findById(id)
    if(!job){
        return res.status(404).json({
            message:"job not found"
        })
    }

    return res.status(200).json({
        message:"job fetched successfully",
        job
    })
    }catch(error) {

        return res.status(500).json({
            message:"internal server error"
        })
    }
}
const updateJobController = async(req,res) => {
    try {

        const {id} = req.params

        const {
            title,
            description,
            company,
            location,
            salary,
            employmentType,
            skills,
            experience
        } = req.body

        if(
            !title ||
            !description ||
            !company ||
            !location ||
            salary === undefined ||
            !employmentType ||
            !skills ||
            experience === undefined
        ){
            return res.status(400).json({
                message:"all fields are required"
            })
        }

        const job = await jobModel.findById(id)

        if(!job){
            return res.status(404).json({
                message:"job not found"
            })
        }

        if(job.recruiter.toString() !== req.user.id){
            return res.status(403).json({
                message:"you are not allowed to update this job"
            })
        }

        job.title = title
        job.description = description
        job.company = company
        job.location = location
        job.salary = salary
        job.employmentType = employmentType
        job.skills = skills
        job.experience = experience

        await job.save()

        return res.status(200).json({
            message:"job updated successfully",
            job
        })

    } catch(error) {

        return res.status(500).json({
            message:"internal server error"
        })
    }
}
const deleteJobController = async(req,res) => {
    try {

        const {id} = req.params

        const job = await jobModel.findById(id)

        if(!job){
            return res.status(404).json({
                message:"job not found"
            })
        }

        if(
            req.user.role !== "admin" &&
            job.recruiter.toString() !== req.user.id
        ){
            return res.status(403).json({
                message:"you are not allowed to delete this job"
            })
        }

        await jobModel.findByIdAndDelete(id)

        return res.status(200).json({
            message:"job deleted successfully"
        })

    } catch(error) {

        return res.status(500).json({
            message:"internal server error"
        })
    }
}
const getMyJobsController = async (req, res) => {
    try {
        const jobs = await jobModel.find({
            recruiter: req.user.id
        })

        return res.status(200).json({
            message: "Jobs fetched successfully",
            jobs
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "internal server error"
        })
    }
}
module.exports={
    createJobController,
    getJobsController,
    getJobsbyIdController,
    updateJobController,
    deleteJobController,
    getMyJobsController
}