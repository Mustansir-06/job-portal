const express=require("express")
const { createConversationController, getConversationController, getConversationByIdController } = require("../controllers/conversation.controller")
const authUser = require("../middleware/auth.middleware")
const authorizeRoles = require("../middleware/role.middleware")
const router=express.Router()
router.post("/:jobId", authUser, authorizeRoles("candidate"), createConversationController)
router.get("/",authUser,authorizeRoles("candidate","recruiter"),getConversationController)
router.get("/:id",authUser,authorizeRoles("candidate","recruiter"),getConversationByIdController)
module.exports=router