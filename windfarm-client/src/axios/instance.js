// Import axios
import axios from "axios";

// Create an instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Replace with your API's base URL
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getJwtToken = () => {
  return localStorage.getItem("JWT_TOKEN");
};

instance.interceptors.request.use(
  (config) => {
    const token = getJwtToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return console.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error);
  }
);

export default instance;
