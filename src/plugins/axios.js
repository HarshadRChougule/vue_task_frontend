import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:6004/api",
})

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('---------- axiosInstance  ');
    // Get token from localStorage
    const token = localStorage.getItem("accessToken")

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInstance

