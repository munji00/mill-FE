import type {
  AxiosError,
  AxiosRequestConfig,
} from "axios";

import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { api } from "./api";
import { mockDb } from "@/utils/mockDb";
import { tokenManager } from "@/features/auth/lib/tokenManager";

type RequestConfig = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: Record<string, unknown>;
};

type ApiError = {
  status?: number;
  data: unknown;
};

export const axiosBaseQuery =
  (): BaseQueryFn<RequestConfig, unknown, ApiError> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const response = await api({
        url,
        method,
        data,
        params,
      });

      return {
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError;

      // Fallback to mock DB if network error, server offline, 404, or no response
      if (err.code === "ERR_NETWORK" || err.response?.status === 404 || !err.response) {
        console.warn(`[Offline Fallback] Accessing mock database for: ${method} ${url}`);
        try {
          const token = tokenManager.get() || "";
          const mockHeaders = { Authorization: token ? `Bearer ${token}` : "" };
          
          // Simulate latency
          await new Promise((resolve) => setTimeout(resolve, 200));
          
          const result = mockDb.handleMockRequest(url, method, data, mockHeaders);
          return { data: result };
        } catch (mockErr: any) {
          return {
            error: {
              status: mockErr.status || 500,
              data: mockErr.data || { message: "Mock DB Error" },
            },
          };
        }
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };