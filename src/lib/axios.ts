import axios from "axios";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://ftserver-ym6z.onrender.com",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return config;

    const parsed = JSON.parse(raw) as { username?: string };
    const userId = parsed?.username;
    if (userId) {
      config.headers["x-user-id"] = userId;
    }
  } catch (error) {
    console.error("Failed to set auth headers:", error);
  }

  return config;
});

export default apiClient;
