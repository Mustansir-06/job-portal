import axios from "axios";
import { useContext, useEffect } from "react";
import { store } from "../context/AuthContext";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})

const refreshApi = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})

export const useApi = () => {

    const { accesstoken, setAccesstoken } = useContext(store)

    useEffect(() => {

        const requestInterceptor = api.interceptors.request.use(
            (config) => {

                if (accesstoken) {
                    config.headers.Authorization = `Bearer ${accesstoken}`
                }

                return config
            }
        )

        const responseInterceptor = api.interceptors.response.use(
            response => response,

            async (error) => {

                if (
                    error.response &&
                    error.response.status === 401 &&
                    !error.config._retry
                ) {

                    error.config._retry = true

                    try {

                        const res = await refreshApi.post("/auth/refresh")

                        setAccesstoken(res.data.accesstoken)

                        error.config.headers.Authorization =
                            `Bearer ${res.data.accesstoken}`

                        return api(error.config)

                    } catch (refreshError) {

                        return Promise.reject(refreshError)
                    }
                }

                return Promise.reject(error)
            }
        )

        return () => {
            api.interceptors.request.eject(requestInterceptor)
            api.interceptors.response.eject(responseInterceptor)
        }

    }, [accesstoken])

    return api
}

export { refreshApi }

export default api;