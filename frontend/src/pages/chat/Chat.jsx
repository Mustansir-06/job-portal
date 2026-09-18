import { useContext, useEffect, useState } from "react"
import { store } from "../../context/AuthContext"
import socket from "../../socket/socket"
import { useApi } from "../../api/axios"

const Chat = () => {

    const { user } = useContext(store)

    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const api = useApi()

    const getConversations = async () => {
        try {
            const res = await api.get("/conversations")

            const conversations = res.data.conversations

            setConversations(conversations)

            if (conversations.length > 0) {

                const firstConversation = conversations[0]

                setSelectedConversation(firstConversation)

                await getMessages(firstConversation._id)

                socket.emit(
                    "join-conversation",
                    firstConversation._id
                )
            }

        } catch (error) {
            console.log(error)
        }
    }

    const getMessages = async (conversationId) => {
        try {
            setIsLoading(true)

            const res = await api.get(
                `/messages/${conversationId}`
            )

            setMessages(res.data.messages)

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const selectConversation = async (conversation) => {

        setSelectedConversation(conversation)

        await getMessages(conversation._id)

        socket.emit(
            "join-conversation",
            conversation._id
        )
    }

    const sendMessage = () => {

        if (!message.trim()) return

        if (!selectedConversation) return

        socket.emit("send-message", {
            conversationId: selectedConversation._id,
            message: message
        })

        setMessage("")
    }

    useEffect(() => {
        getConversations()
    }, [])

    useEffect(() => {

        const receiveMessage = (newMessage) => {

            if (
                newMessage.conversation !== selectedConversation?._id
            ) {
                return
            }

            setMessages((prev) => [
                ...prev,
                newMessage
            ])
        }

        socket.on(
            "receive-message",
            receiveMessage
        )

        return () => {
            socket.off(
                "receive-message",
                receiveMessage
            )
        }

    }, [selectedConversation])

    return (
        <div className="h-[calc(100vh-64px)] flex bg-[#f3f5f7]">

            {/* Conversations */}

            <div className="w-80 bg-white border-r border-[#e1e5e9] flex flex-col">

                {/* Sidebar Header */}

                <div className="px-5 py-6 border-b border-[#e1e5e9]">

                    <h1 className="text-xl font-semibold text-[#172b4d]">
                        Messages
                    </h1>

                    <p className="text-sm text-[#7a869a] mt-1">
                        Your conversations
                    </p>

                </div>


                {/* Conversation List */}

                <div className="flex-1 overflow-y-auto">

                    {conversations.length === 0 && (

                        <div className="p-5 text-sm text-[#7a869a]">
                            No conversations yet
                        </div>

                    )}

                    {conversations.map((conversation) => {

                        const otherUser =
                            user?.role === "candidate"
                                ? conversation.recruiter
                                : conversation.candidate

                        return (

                            <button
                                key={conversation._id}
                                onClick={() =>
                                    selectConversation(conversation)
                                }
                                className={`w-full text-left px-5 py-4 border-b border-[#edf0f2] transition ${
                                    selectedConversation?._id === conversation._id
                                        ? "bg-[#eef4f8]"
                                        : "hover:bg-[#f8fafb]"
                                }`}
                            >

                                <div className="flex items-center gap-3">

                                    {/* Avatar */}

                                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#dce9f2] text-[#173b57] flex items-center justify-center font-semibold">

                                        {otherUser?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}

                                    </div>


                                    <div className="min-w-0">

                                        <div className="font-semibold text-[#26364a] truncate">
                                            {otherUser?.name || "User"}
                                        </div>

                                        <div className="text-sm text-[#7a869a] mt-1 truncate">
                                            {conversation.job?.title || "Job"}
                                        </div>

                                    </div>

                                </div>

                            </button>

                        )
                    })}

                </div>

            </div>


            {/* Chat */}

            <div className="flex-1 flex flex-col min-w-0">

                {!selectedConversation ? (

                    /* Empty State */

                    <div className="flex-1 flex items-center justify-center">

                        <div className="text-center">

                            <div className="h-16 w-16 mx-auto rounded-full bg-[#e3ebf1] flex items-center justify-center text-[#173b57] text-2xl">
                                💬
                            </div>

                            <h2 className="text-xl font-semibold text-[#344054] mt-5">
                                Select a conversation
                            </h2>

                            <p className="text-[#7a869a] mt-2">
                                Choose a conversation to start chatting
                            </p>

                        </div>

                    </div>

                ) : (

                    <>

                        {/* Chat Header */}

                        <div className="h-[76px] shrink-0 bg-white border-b border-[#e1e5e9] px-6 flex items-center">

                            <div className="flex items-center gap-3">

                                {/* Avatar */}

                                <div className="h-11 w-11 rounded-full bg-[#dce9f2] text-[#173b57] flex items-center justify-center font-semibold">

                                    {(user?.role === "candidate"
                                        ? selectedConversation.recruiter?.name
                                        : selectedConversation.candidate?.name
                                    )
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"}

                                </div>


                                <div>

                                    <h2 className="font-semibold text-[#172b4d]">

                                        {user?.role === "candidate"
                                            ? selectedConversation.recruiter?.name
                                            : selectedConversation.candidate?.name}

                                    </h2>

                                    <p className="text-xs text-[#7a869a] mt-0.5">

                                        {selectedConversation.job?.title}

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Messages */}

                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3 bg-[#f5f7f9]">

                            {isLoading ? (

                                <div className="flex items-center justify-center h-full">

                                    <p className="text-sm text-[#7a869a]">
                                        Loading messages...
                                    </p>

                                </div>

                            ) : messages.length === 0 ? (

                                <div className="flex items-center justify-center h-full">

                                    <div className="text-center">

                                        <p className="text-[#667085]">
                                            No messages yet.
                                        </p>

                                        <p className="text-sm text-[#98a2b3] mt-1">
                                            Start the conversation.
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                messages.map((msg) => {

                                    const isMine =
                                    String(msg.sender?._id || msg.sender) ===
                                    String(user?._id || user?.id)

                                    return (

                                        <div
                                            key={msg._id}
                                            className={`flex ${
                                                isMine
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >

                                            {/* Message Bubble */}

                                            <div
                                                className={`max-w-[65%] px-4 py-2.5 shadow-sm ${
                                                    isMine
                                                        ? "bg-[#d9fdd3] text-[#1f2937] rounded-2xl rounded-br-md"
                                                        : "bg-white text-[#344054] border border-[#e5e7eb] rounded-2xl rounded-bl-md"
                                                }`}
                                            >

                                                <p className="text-sm leading-5 break-words">
                                                    {msg.message}
                                                </p>


                                                {/* Time */}

                                                <div
                                                    className={`text-[10px] mt-1 text-right ${
                                                        isMine
                                                            ? "text-[#667f63]"
                                                            : "text-[#98a2b3]"
                                                    }`}
                                                >

                                                    {new Date(
                                                        msg.createdAt
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}

                                                </div>

                                            </div>

                                        </div>

                                    )

                                })

                            )}

                        </div>


                        {/* Input */}

                        <div className="bg-white border-t border-[#e1e5e9] px-5 py-4">

                            <div className="flex items-center gap-3">

                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            sendMessage()
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-[#f4f6f8] border border-[#e1e5e9] rounded-2xl px-5 py-3 text-sm text-[#344054] placeholder:text-[#98a2b3] outline-none focus:border-[#7c9bb2] focus:ring-2 focus:ring-[#dce9f2]"
                                />

                                <button
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                    className="px-6 py-3 rounded-2xl bg-[#173b57] text-white text-sm font-medium hover:bg-[#214d70] transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Send
                                </button>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </div>
    )
}

export default Chat