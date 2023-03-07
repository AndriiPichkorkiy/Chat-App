import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../redux/reduxTsHooks";
import { isAuth } from "../redux/auth/auth-selectors";

export const PrivateRoute = () => {
  const isLoggedIn = useAppSelector(isAuth);

  if (!isLoggedIn) return <Navigate to="/sign-in" />;
  else return <Outlet />;
};

export const PublicRoute = () => {
  const isLoggedIn = useAppSelector(isAuth);

  if (isLoggedIn) return <Navigate to="/chat" />;
  else return <Outlet />;
};
