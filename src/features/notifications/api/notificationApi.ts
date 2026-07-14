import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse } from "@/types";
import type { MockNotification } from "@/utils/mockDb";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ApiResponse<MockNotification[]>, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation<ApiResponse<MockNotification>, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } = notificationApi;
export default notificationApi;
