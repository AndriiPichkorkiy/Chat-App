import { createSlice } from "@reduxjs/toolkit";
import { IFormData } from "../types/formTypes";
interface userState {
  name: string;
  email: string;
  password: string;
  isLogIn: boolean;
}

const initialState: userState = {
  name: "",
  email: "",
  password: "",
  isLogIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, { payload }: { payload: IFormData }) => {
      state.name = payload.name;
      state.email = payload.email;
      state.password = payload.password;
      state.isLogIn = true;
    },
    logOut: () => initialState,
  },
});

export const { logIn, logOut } = userSlice.actions;

export default userSlice.reducer;
