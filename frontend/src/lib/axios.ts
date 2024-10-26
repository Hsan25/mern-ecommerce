import axios from "axios";
const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API,
  withCredentials: true,
});



export default apiService;
