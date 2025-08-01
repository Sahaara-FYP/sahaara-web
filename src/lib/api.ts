import axios from "axios";
import { toast } from "sonner";
import { manualLogout } from "@/contexts/AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api", //Backend API url
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.detail == "Invalid or expired token"
    ) {
      toast.error("Session expired. Please login again.");
      manualLogout();
    }

    if (error.response) {
      const detail =
        error.response.data?.detail ||
        error.response.data?.message ||
        error.message;

      toast.error(detail || "Something went wrong");
      console.error("API Error:", error.response);
    } else if (error.request) {
      toast.error("No response from server");
      console.error("No response:", error.request);
    } else {
      toast.error("Request error");
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
