const conversationModel = require("../models/conversation.model")
const messageModel = require("../models/message.model")

const getMessagesController=async(req,res)=>{
    try {
        const {conversationId}=req.params
        const isExists=await conversationModel.findOne({
            _id:conversationId,
            $or:[
                {candidate:req.user.id},
                {recruiter:req.user.id}
            ]
        })
        if(!isExists){
            return res.status(404).json({
                message:"conversation does not exists"
            })
        }
        const messages=await messageModel.find({
            conversation:conversationId,
            
        }).sort({ createdAt: 1 })
        return res.status(200).json({
            message:"fetched all the messages successfully",
            messages
        })
    } catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
module.exports={
    getMessagesController
}