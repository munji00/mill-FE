import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse } from "@/types";
import type { MockLabour } from "@/utils/mockDb";

export const labourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabour: builder.query<ApiResponse<MockLabour[]>, void>({
      query: () => ({
        url: "/labour",
        method: "GET",
      }),
      providesTags: ["Labour"],
    }),
    createLabour: builder.mutation<ApiResponse<MockLabour>, Omit<MockLabour, "id" | "tenantId">>({
      query: (body) => ({
        url: "/labour",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Labour", "Dashboard", "Notification"],
    }),
    updateLabour: builder.mutation<ApiResponse<MockLabour>, { id: string; data: Partial<MockLabour> }>({
      query: ({ id, data }) => ({
        url: `/labour/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Labour", "Dashboard", "Notification"],
    }),
    deleteLabour: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/labour/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Labour", "Dashboard", "Notification"],
    }),
  }),
});

export const {
  useGetLabourQuery,
  useCreateLabourMutation,
  useUpdateLabourMutation,
  useDeleteLabourMutation,
} = labourApi;
export default labourApi;
