const app = require("./src/app/app")
const http = require("http")
const server = http.createServer(app)
const jwt = require("jsonwebtoken")
const { Server } = require("socket.io")

const connectDB = require("./src/config/db")
const config = require("./src/config/config")
const conversationModel = require("./src/models/conversation.model")
const messageModel = require("./src/models/message.model")
const config=require("./src/config/config")
const io = new Server(server, {
    cors: {
        origin:config.FRONTEND_URL
    }
})

connectDB()

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token

        if (!token) {
            return next(new Error("unauthorized"))
        }

        const decoded = jwt.verify(
            token,
            config.ACCESS_TOKEN_SECRET
        )

        socket.user = decoded

        next()

    } catch (error) {
        next(new Error("unauthorized"))
    }
})

io.on("connection", (socket) => {

    socket.on("join-conversation", async (conversationId) => {

        try {

            const conversation = await conversationModel.findOne({
                _id: conversationId,
                $or: [
                    { candidate: socket.user.id },
                    { recruiter: socket.user.id }
                ]
            })

            if (!conversation) {
                return socket.emit("chat-error", {
                    message: "You are not part of this conversation"
                })
            }

            socket.join(conversationId)

        } catch (error) {

            console.log("join conversation error:", error)

            socket.emit("chat-error", {
                message: "Unable to join conversation"
            })
        }
    })


    socket.on("send-message", async (data) => {

        try {

            const { conversationId, message } = data

            if (!message || !message.trim()) {
                return socket.emit("chat-error", {
                    message: "Message cannot be empty"
                })
            }

            const conversation = await conversationModel.findOne({
                _id: conversationId,
                $or: [
                    { candidate: socket.user.id },
                    { recruiter: socket.user.id }
                ]
            })

            if (!conversation) {
                return socket.emit("chat-error", {
                    message: "You are not part of this conversation"
                })
            }

            const newMessage = await messageModel.create({
                conversation: conversationId,
                sender: socket.user.id,
                message: message.trim()
            })

            io.to(conversationId).emit(
                "receive-message",
                newMessage
            )

        } catch (error) {

            console.log("send message error:", error)

            socket.emit("chat-error", {
                message: "Unable to send message"
            })
        }
    })

})
server.listen(config.PORT, "0.0.0.0", () => {
    console.log(`server is running at port ${config.PORT}`)
})