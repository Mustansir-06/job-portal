const mongoose=require("mongoose")
const conversationSchema=new mongoose.Schema({
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    recruiter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"job",
        required:true
    }
},{
    timestamps:true
})
const conversationModel=mongoose.model("conversation",conversationSchema)
module.exports=conversationModel