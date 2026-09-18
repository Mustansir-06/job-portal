import { createContext, useEffect, useState } from "react"
import { refreshApi } from "../api/axios"
import socket from "../socket/socket"

export const store = createContext()

const AuthContext = ({ children }) => {

    const [user, setUser] = useState(null)
    const [accesstoken, setAccesstoken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshUser = async () => {

        try {

            const res = await refreshApi.post("/auth/refresh")

            setUser(res.data.user)
            setAccesstoken(res.data.accesstoken)

        } catch (error) {

            console.log(error)

        } finally {

            setIsLoading(false)

        }
    }


    // Get logged-in user when application starts

    useEffect(() => {

        refreshUser()

    }, [])


    // Connect Socket.IO after authentication

    useEffect(() => {

        if (!accesstoken) return

        socket.auth = {
            token: accesstoken
        }

        socket.connect()

        return () => {

            socket.disconnect()

        }

    }, [accesstoken])


    return (
        <store.Provider
            value={{
                user,
                setUser,
                accesstoken,
                setAccesstoken,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </store.Provider>
    )
}

export default AuthContext