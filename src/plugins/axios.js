import axios from "axios";

const axiosInstance = axios.create({
    baseURL:'http://localhost:6004/api'
})

export default axiosInstance;