import { baseApi } from "@/app/services/api/baseApi";
import type { ApiResponse, User } from "@/types";

export const partnersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<ApiResponse<User[]>, void>({
      query: () => ({
        url: "/users/partners",
        method: "GET",
      }),
      providesTags: ["Auth"], // Since they are users, we can use Auth or a generic tag
    }),
    createPartner: builder.mutation<ApiResponse<User>, Omit<User, "id" | "role" | "tenant">>({
      query: (body) => ({
        url: "/users/partners",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useGetPartnersQuery, useCreatePartnerMutation } = partnersApi;
export default partnersApi;
