import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse } from "@/types";
import type { MockSale } from "@/utils/mockDb";

export const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<ApiResponse<MockSale[]>, void>({
      query: () => ({
        url: "/sales",
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),
    createSale: builder.mutation<ApiResponse<MockSale>, Omit<MockSale, "id" | "tenantId">>({
      query: (body) => ({
        url: "/sales",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Sales", "Dashboard", "Notification"],
    }),
    updateSale: builder.mutation<ApiResponse<MockSale>, { id: string; data: Partial<MockSale> }>({
      query: ({ id, data }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Sales", "Dashboard", "Notification"],
    }),
    deleteSale: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales", "Dashboard", "Notification"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} = salesApi;
export default salesApi;
