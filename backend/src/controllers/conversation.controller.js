const conversationModel = require("../models/conversation.model")
const jobModel = require("../models/job.model")

const createConversationController=async(req,res)=>{
    try {
        const {jobId}=req.params
        const id=req.user.id
        const jobdata=await jobModel.findById(jobId).populate("recruiter")
        if(!jobdata){
            return res.status(404).json({
                message:"no job exists"
            })
        }
        const recruiter = jobdata.recruiter._id
        if(recruiter.toString()===id){
            return res.status(401).json({
                message:"you cannot message yourself"
            })
        }
        const isAlreadyExists=await conversationModel.findOne({
            candidate:id,
            recruiter,
            job:jobId
        })
        if(isAlreadyExists){
            return res.status(409).json({
                message:"conversation already exists"
            })
        }
        const conversation=await conversationModel.create({
            candidate:id,
            recruiter,
            job:jobId
        })
        return res.status(201).json({
            message:"conversation created successfully",
            conversation
        })
    }catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }

}
const getConversationController=async(req,res)=>{
    try {
        const conversations=await conversationModel.find({
            $or:[
                {candidate:req.user.id},
                {recruiter:req.user.id}
            ]
        }).populate("candidate", "name email")
          .populate("recruiter", "name email")
          .populate("job", "title")
        return res.status(200).json({
            message:"conversations fetched succesfully",
            conversations
        })
    }catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
const getConversationByIdController=async(req,res)=>{
    try {
        const { id } = req.params
        const conversation = await conversationModel.findOne({
            _id: id,
            $or: [
                { candidate: req.user.id },
                { recruiter: req.user.id }
            ]
        })
        if(!conversation){
            return res.status(404).json({
                message:"no chat exits"
            })
        }
        return res.status(200).json({
            message:"conversation fetched successfully",
            conversation
        })
    }catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
module.exports={
    createConversationController,
    getConversationController,
    getConversationByIdController
}