import { createSlice } from "@reduxjs/toolkit";
import { ILoginResponse } from "../../types/apiTypes";
interface userState {
  name: string;
  email: string;
  token: string;
  isLogIn: boolean;
}

const initialState: userState = {
  name: "",
  email: "",
  token: "",
  isLogIn: false,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, { payload }: { payload: ILoginResponse["user"] }) => {
      state.name = payload.name;
      state.email = payload.email;
      state.token = payload.token;
      state.isLogIn = true;
    },
    logOut: () => initialState,
  },
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
