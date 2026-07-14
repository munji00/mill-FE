import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse, Tenant } from "@/types";

export const partyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParties: builder.query<ApiResponse<Tenant[]>, void>({
      query: () => ({
        url: "/tenants",
        method: "GET",
      }),
      providesTags: ["Party"],
    }),
    createParty: builder.mutation<
      ApiResponse<Tenant>,
      Omit<Tenant, "id" | "subscription"> & { subscriptionMonths?: number }
    >({
      query: (body) => ({
        url: "/tenants",
        method: "POST",
        data: {
          tenantName: body.name,
          code: body.code,
          email: body.email,
          contactNumber: body.contactNumber,
          registerNumber: body.registerNumber,
          ownerName: body.ownerName,
          ownerMobile: body.ownerMobile,
          state: body.state,
          city: body.city,
          townOrVillage: body.townOrVillage,
          subscriptionMonths: body.subscriptionMonths,
        },
      }),
      invalidatesTags: ["Party", "Dashboard"],
    }),
    updateParty: builder.mutation<ApiResponse<Tenant>, { id: string; data: Partial<Tenant> }>({
      query: ({ id, data }) => ({
        url: `/tenants/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Party", "Dashboard"],
    }),
    deleteParty: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/tenants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Party", "Dashboard"],
    }),
  }),
});

export const {
  useGetPartiesQuery,
  useCreatePartyMutation,
  useUpdatePartyMutation,
  useDeletePartyMutation,
} = partyApi;
export default partyApi;
