import { useAppDispatch } from "../redux/reduxTsHooks";
import { logOut } from "../redux/auth/auth-slice";
import { Link, Outlet } from "react-router-dom";

const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  function doLogOut() {
    dispatch(logOut());
  }
  return (
    <div>
      <p>DashboardScreen</p>
      <Link to="general">go to general</Link>
      <br />
      <Link to="cabinet">go to cabinet</Link>
      <br />
      <Link to="privat">go to privat</Link>
      <br />
      <button onClick={doLogOut}>LogOut</button>
      <Outlet />
    </div>
  );
};

export default DashboardScreen;
