import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse } from "@/types";
import type { MockPurchase } from "@/utils/mockDb";

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchases: builder.query<ApiResponse<MockPurchase[]>, void>({
      query: () => ({
        url: "/purchase",
        method: "GET",
      }),
      providesTags: ["Purchase"],
    }),
    createPurchase: builder.mutation<ApiResponse<MockPurchase>, Omit<MockPurchase, "id" | "tenantId">>({
      query: (body) => ({
        url: "/purchase",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Purchase", "Dashboard", "Notification"],
    }),
    updatePurchase: builder.mutation<ApiResponse<MockPurchase>, { id: string; data: Partial<MockPurchase> }>({
      query: ({ id, data }) => ({
        url: `/purchase/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Purchase", "Dashboard", "Notification"],
    }),
    deletePurchase: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/purchase/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase", "Dashboard", "Notification"],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
export default purchaseApi;
