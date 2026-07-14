import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse } from "@/types";
import type { MockExpense } from "@/utils/mockDb";

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<ApiResponse<MockExpense[]>, void>({
      query: () => ({
        url: "/expenses",
        method: "GET",
      }),
      providesTags: ["Expense"],
    }),
    createExpense: builder.mutation<ApiResponse<MockExpense>, Omit<MockExpense, "id" | "tenantId">>({
      query: (body) => ({
        url: "/expenses",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Expense", "Dashboard", "Notification"],
    }),
    updateExpense: builder.mutation<ApiResponse<MockExpense>, { id: string; data: Partial<MockExpense> }>({
      query: ({ id, data }) => ({
        url: `/expenses/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Expense", "Dashboard", "Notification"],
    }),
    deleteExpense: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense", "Dashboard", "Notification"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApi;
export default expensesApi;
