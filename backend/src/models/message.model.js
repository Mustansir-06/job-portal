const mongoose=require("mongoose")
const messageSchema=new mongoose.Schema({
    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"conversation",
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    message:{
        type:String,
        required:true,
        trim: true
    }
},{timestamps:true})
const messageModel=mongoose.model("message",messageSchema)
module.exports=messageModel