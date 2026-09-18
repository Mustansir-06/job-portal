const express=require("express")
const authUser = require("../middleware/auth.middleware")
const { chatController } = require("../controllers/ai.controller")

const router = express.Router()

router.post("/chat", authUser, chatController)
module.exports=router