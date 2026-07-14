import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: axiosBaseQuery(),

  tagTypes: [
    "Auth",
    "Dashboard",
    "Purchase",
    "Sales",
    "Expense",
    "Inventory",
    "Labour",
    "Notification",
    "Party",
  ],

  endpoints: () => ({}),
});