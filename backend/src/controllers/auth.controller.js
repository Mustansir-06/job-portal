const userModel = require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const config = require("../config/config")
const uploadFile = require("../services/imagekit.service")
const userRegisterController=async(req,res)=>{
    const {name,email,password,role}=req.body
    if(!name || !email || !password){
        return res.status(400).json({
            message:"name, email and password is required"
        })
    }
    if(role && !["candidate","recruiter"].includes(role)){
        return res.status(400).json({
            message:"invalid role"
        })
    }
    const isAlreadyExists=await userModel.findOne({email})
    if(isAlreadyExists) {
        return res.status(409).json({
            message:"user with this email already exists"
        })
    }
    const hashpassword=await bcrypt.hash(password,10)
    const user=await userModel.create({
        name,
        email,
        password:hashpassword,
        role:role || "candidate"
    })
    const refreshtoken=jwt.sign({id:user._id,role:user.role},config.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})
    const accesstoken=jwt.sign({id:user._id,role:user.role},config.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
    user.refreshToken=refreshtoken
    await user.save()
    res.cookie("refreshtoken",refreshtoken,{
        httpOnly:true,
        secure: true,
        sameSite: "none"
    })
    return res.status(201).json({
        message:"user registered successfully",
        user: {
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            resume:user.resume
        },
        accesstoken
    })
}
const userLoginController=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({
            message:"email and password is required"
        })
    }
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(409).json({
            message:"user with this email does not exists"
        })
    }
    const isSame=await bcrypt.compare(password,user.password)
    if(!isSame){
        return res.status(403).json({
            message:"invalid Credentials"
        })
    }
    const refreshtoken=jwt.sign({id:user._id,role:user.role},config.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})
    const accesstoken=jwt.sign({id:user._id,role:user.role},config.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
    user.refreshToken=refreshtoken
    await user.save()
    res.cookie("refreshtoken",refreshtoken,{
        httpOnly:true,
        secure: true,
        sameSite: "none"
    })
    return res.status(200).json({
        message:"user loggedin successfully",
        user: {
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            resume:user.resume
        },
        accesstoken
    })

}
const getMeController=async(req,res)=>{
    const user=await userModel.findById(req.user.id)
    if(!user){
        return res.status(404).json({
        message:"user not found"
        })
    }
    return res.status(200).json({
        message:"user fetched successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            resume:user.resume
        }
    })

}
const refreshController=async(req,res)=>{
    const user=req.user
    const newrefreshtoken=jwt.sign({id:user._id,role:user.role},config.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})
    const accesstoken=jwt.sign({id:user._id,role:user.role},config.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
    user.refreshToken=newrefreshtoken
    await user.save()
    res.cookie("refreshtoken",newrefreshtoken,{
        httpOnly:true,
        secure: true,
        sameSite: "none"
    })
    return res.status(200).json({
        message:"user refreshed successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            resume:user.resume
        },
        accesstoken
    })
}
const logoutController=async(req,res)=>{
    const user=req.user
    user.refreshToken=null
    await user.save()
    res.clearCookie("refreshtoken",{
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    return res.status(200).json({
        message:"user loggedout successfully"
    })
}
const uploadResumeController = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "resume is required"
            })
        }

        const response = await uploadFile(req.file.buffer)

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            {
                resume: response.url
            },
            {
                returnDocument: "after"
            }
        )

        return res.status(200).json({
            message: "resume uploaded successfully",
            user
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: "internal server error"
        })
    }
}
module.exports={
    userRegisterController,
    userLoginController,
    getMeController,
    refreshController,
    logoutController,
    uploadResumeController
}