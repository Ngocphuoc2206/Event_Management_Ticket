import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DEFAULT_PAGE_TITLE } from "@/features/auth/constants";

type LayoutState = {
  title: string;
};

const initialState: LayoutState = {
  title: DEFAULT_PAGE_TITLE,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
  },
});

export const { setTitle } = layoutSlice.actions;
export default layoutSlice.reducer;
