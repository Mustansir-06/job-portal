import { io } from "socket.io-client"

const server = io(import.meta.env.VITE_SOCKET_URL, {
    autoConnect: false
})

export default server