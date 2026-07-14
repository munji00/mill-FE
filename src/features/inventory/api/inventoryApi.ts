import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse } from "@/types";
import type { MockInventory } from "@/utils/mockDb";

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<ApiResponse<MockInventory[]>, void>({
      query: () => ({
        url: "/inventory",
        method: "GET",
      }),
      providesTags: ["Inventory"],
    }),
    createInventory: builder.mutation<ApiResponse<MockInventory>, Omit<MockInventory, "id" | "tenantId">>({
      query: (body) => ({
        url: "/inventory",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Inventory", "Dashboard", "Notification"],
    }),
    updateInventory: builder.mutation<ApiResponse<MockInventory>, { id: string; data: Partial<MockInventory> }>({
      query: ({ id, data }) => ({
        url: `/inventory/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Inventory", "Dashboard", "Notification"],
    }),
    deleteInventory: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/inventory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory", "Dashboard", "Notification"],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = inventoryApi;
export default inventoryApi;
