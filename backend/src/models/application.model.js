const mongoose=require("mongoose")
const applicationSchema=new mongoose.Schema({
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"job",
        required:true
    },
    recruiter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum: [
        "applied",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
        "withdrawn"
        ],
        default: "applied"
    }
},{ timestamps: true })
const applicationModel=mongoose.model("application",applicationSchema)
module.exports=applicationModel