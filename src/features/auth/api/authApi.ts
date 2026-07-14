import { baseApi } from "@/app/services/api/baseApi";
import { ENDPOINTS } from "@/app/services/api/endpoints";

import type { ApiResponse } from "@/types";
import type {
  LoginData,
  LoginRequest,
  RefreshTokenData,
} from "../types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginData>, LoginRequest>({
      query: (body) => ({
        url: ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        data: body,
      }),

      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<
      ApiResponse<RefreshTokenData>,
      void
    >({
      query: () => ({
        url: ENDPOINTS.AUTH.REFRESH,
        method: "POST",
      }),
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: ENDPOINTS.AUTH.LOGOUT,
        method: "POST",
      }),

      invalidatesTags: ["Auth"],
    }),

    me: builder.query<ApiResponse<LoginData["user"]>, void>({
      query: () => ({
        url: ENDPOINTS.AUTH.ME,
      }),

      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useLazyMeQuery,
  useRefreshTokenMutation,
} = authApi;