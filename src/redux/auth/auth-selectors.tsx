import { RootState } from "../store";

export const isAuth = (store: RootState) => store.user.isLogIn;
export const getName = (store: RootState) => store.user.name;
export const getEmail = (store: RootState) => store.user.email;
