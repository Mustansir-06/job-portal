const jwt=require("jsonwebtoken")
const config = require("../config/config")
const authUser=(req,res,next)=>{
    try{

        const authorization=req.headers.authorization

        if(!authorization){

            return res.status(401).json({
                message:"unauthorized"
            })
        }

        const accesstoken=authorization.split(" ")[1]

        if(!accesstoken){

            return res.status(401).json({
                message:"unauthorized"
            })
        }

        const decoded=jwt.verify(
            accesstoken,
            config.ACCESS_TOKEN_SECRET
        )

        req.user=decoded

        next()

    }catch(error){

        return res.status(401).json({
            message:"unauthorized"
        })
    }
}
module.exports=authUser