import { RootState } from "../store";

export const isAuth = (store: RootState) => store.user.isLogIn;
export const getName = (store: RootState) => store.user.name;
export const getEmail = (store: RootState) => store.user.email;
export const getToken = (store: RootState) => store.user.token;
export const getAuthId = (store: RootState) => store.user._id;
