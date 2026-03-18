import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LayoutState = {
  title: string;
};

const initialState: LayoutState = {
  title: "Event Ticketing System",
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
