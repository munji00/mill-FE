import axios from "axios";

import { env } from "@/config/env";
import { tokenManager } from "@/features/auth/lib/tokenManager";

export const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenManager.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});