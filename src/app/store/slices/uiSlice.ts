import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: "ui",

  initialState,

  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },

    openSidebar(state) {
      state.sidebarOpen = true;
    },

    closeSidebar(state) {
      state.sidebarOpen = false;
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;