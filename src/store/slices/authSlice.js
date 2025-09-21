
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  company: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { token, user, company } = action.payload;
      state.token = token;
      state.user = user;
      state.company = company;

      if (token) {
        sessionStorage.setItem("token", token);
      }
    },
    clearAuthData: (state) => {
      state.token = null;
      state.user = null;
      state.company = null;
      sessionStorage.removeItem("token");
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
const authReducer = authSlice.reducer
export default authReducer ;
