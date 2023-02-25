import { useAppDispatch } from "../redux/reduxTsHooks";
import { logOut } from "../redux/auth/auth-slice";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  function doLogOut() {
    dispatch(logOut());
  }
  return (
    <Page>
      <RouteColumn>
        <p>DashboardScreen</p>
        <Link to="general">go to general</Link>
        <br />
        <Link to="cabinet">go to cabinet</Link>
        <br />
        <Link to="privat">go to privat</Link>
        <br />
        <button onClick={doLogOut}>LogOut</button>
      </RouteColumn>
      <OutletColum>
        <Outlet />
      </OutletColum>
    </Page>
  );
};

export default DashboardScreen;

const Page = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;
const RouteColumn = styled.div`
  height: 100%;
  flex: 0 200px;
  background-color: orange;
  padding: 10px;
`;

const OutletColum = styled.div`
  flex: 1 auto;
  padding: 10px;
`;
