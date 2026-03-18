import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  id: string | null;
  fullName: string | null;
  role: "CUSTOMER" | "ORGANIZER" | "ADMIN" | null;
  isLoggedIn: boolean;
};

const initialState: UserState = {
  id: null,
  fullName: null,
  role: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload, isLoggedIn: true };
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
