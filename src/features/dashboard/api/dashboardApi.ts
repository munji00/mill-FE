import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse } from "@/types";

export interface PartyDashboardStats {
  summary: {
    totalPurchase: number;
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    inventoryItemCount: number;
    labourCount: number;
  };
  chartData: Array<{
    name: string;
    Sales: number;
    Expenses: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    msg: string;
    date: string;
  }>;
}

export interface MasterAdminDashboardStats {
  totalParties: number;
  activeParties: number;
  growthPercentage: number;
  partiesGrowth: Array<{
    month: string;
    parties: number;
  }>;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiResponse<PartyDashboardStats & MasterAdminDashboardStats>, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
export default dashboardApi;
