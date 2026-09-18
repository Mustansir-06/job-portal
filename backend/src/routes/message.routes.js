const express=require("express")
const authUser = require("../middleware/auth.middleware")
const authorizeRoles = require("../middleware/role.middleware")
const { getMessagesController } = require("../controllers/message.controller")
const router=express.Router()
router.get("/:conversationId", authUser, authorizeRoles("candidate","recruiter"),getMessagesController)
module.exports=router