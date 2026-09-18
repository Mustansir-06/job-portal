const mongoose=require("mongoose")
const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    company: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    salary: {
        type: Number,
        required: true
    },

    employmentType: {
        type: String,
        enum: ["full-time", "part-time", "internship", "contract"],
        required: true
    },

    skills: {
        type: [String],
        required: true
    },

    experience: {
        type: Number,
        required: true
    },

    status:{
        type:String,
        enum:["active","closed","draft"],
        default:"active"
    },

    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

}, {
    timestamps: true
})
const jobModel=mongoose.model("job",jobSchema)
module.exports=jobModel