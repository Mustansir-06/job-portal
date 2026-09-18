const jwt=require("jsonwebtoken")
const config = require("../config/config")
const userModel = require("../models/user.model")
const refreshUser=async(req,res,next)=>{

    try{

        const refreshtoken=req.cookies.refreshtoken

        if(!refreshtoken){

            return res.status(401).json({
                message:"unauthorized"
            })
        }

        const decoded=jwt.verify(
            refreshtoken,
            config.REFRESH_TOKEN_SECRET
        )

        const user=await userModel.findById(decoded.id)

        if(!user){

            return res.status(401).json({
                message:"unauthorized"
            })
        }

        if(user.refreshToken !== refreshtoken){

            user.refreshToken=null
            await user.save()

            return res.status(401).json({
                message:"unauthorized"
            })
        }

        req.user=user

        next()

    }catch(error){

        return res.status(401).json({
            message:"unauthorized"
        })
    }
}
module.exports=refreshUser