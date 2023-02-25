import { createSlice } from "@reduxjs/toolkit";
import { ILoginResponse } from "../../types/apiTypes";
interface userState {
  name: string;
  email: string;
  token: string;
  isLogIn: boolean;
  _id: string;
}

const initialState: userState = {
  name: "",
  email: "",
  token: "",
  isLogIn: false,
  _id: "",
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
      state._id = payload._id;
    },
    logOut: () => initialState,
  },
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
