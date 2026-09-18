const express=require("express")
const app=express()
const cors=require("cors")
const cookieParser=require("cookie-parser")
const authRoutes=require("../routes/auth.routes")
const jobRoutes=require("../routes/job.routes")
const applicationRoutes=require("../routes/application.routes")
const dashboardRoutes=require("../routes/dashboard.route")
const adminRoutes=require("../routes/admin.routes")
const aiRoutes=require("../routes/ai.routes")
const conversationRoutes=require("../routes/conversation.routes")
const messageRoutes=require("../routes/message.routes")
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("server is running")
})
app.use("/api/auth",authRoutes)
app.use("/api/jobs",jobRoutes)
app.use("/api/applications",applicationRoutes)
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/ai",aiRoutes)
app.use("/api/conversations", conversationRoutes)
app.use("/api/messages", messageRoutes)
module.exports=app