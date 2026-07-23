import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse } from "@/types";

export interface TransactionRecord {
  id: string;
  type: "Purchase" | "Sale" | "Expense" | "Labour";
  name: string;
  itemName: string;
  amount: number;
  date: string;
  details: string;
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  name?: string;
  itemName?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<
      ApiResponse<TransactionRecord[]> & {
        pagination: {
          totalCount: number;
          totalPages: number;
          currentPage: number;
          limit: number;
        };
        summary: {
          totalSales: number;
          totalPurchase: number;
          totalExpenses: number;
          netAmount: number;
        };
      },
      AnalyticsParams
    >({
      query: (params) => ({
        url: "/analytics",
        method: "GET",
        params,
      }),
      providesTags: ["Purchase", "Sales", "Expense", "Labour"],
    }),
  }),
});

export const { useGetAnalyticsQuery } = analyticsApi;
export default analyticsApi;
