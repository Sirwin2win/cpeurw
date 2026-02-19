import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { info: null, token: null },
  reducers: {
    setUser: (state, action) => {
      state.info = action.payload.info;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.info = null;
      state.token = null;
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
