import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://jarn-nai-backend-nextjs.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});
