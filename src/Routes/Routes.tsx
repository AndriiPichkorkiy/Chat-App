import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../redux/reduxTsHooks";
import { isAuth } from "../redux/auth/auth-selectors";

export const PrivateRoute = () => {
  const isLeggedIn = useAppSelector(isAuth);

  if (!isLeggedIn) return <Navigate to="/sign-in" />;
  else return <Outlet />;
};

export const PublicRoute = () => {
  const isLeggedIn = useAppSelector(isAuth);

  if (isLeggedIn) return <Navigate to="/chat" />;
  else return <Outlet />;
};
