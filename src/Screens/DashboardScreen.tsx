import { useAppDispatch, useAppSelector } from "../redux/reduxTsHooks";
import { logOut } from "../redux/auth/auth-slice";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { IActiveUserArray } from "../types/chatTypes";
import { getToken } from "../redux/auth/auth-selectors";
import { io, Socket } from "socket.io-client";

const WEB_ADRESS = "http://localhost:4000";

const DashboardScreen: React.FC = () => {
  console.log("Render DashboardScreen");
  const dispatch = useAppDispatch();
  const [activeUsers, setActiveUsers] = useState<IActiveUserArray>([]);
  const [roomsList, setRoomsList] = useState([]);

  const token = useAppSelector(getToken);
  const socketRef = useRef<Socket>();
  const inputNewRoomRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socketRef.current = io(WEB_ADRESS, {
      query: { token },
      // "force new connection": true,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ["websocket"],
    });

    socketRef.current.on("newUserResponse", (data) => {
      console.log("fire newUserResponse");
      console.log("data", data);
      setActiveUsers(data.users);
      setRoomsList(data.rooms);
    });
  }, []);

  function doLogOut() {
    socketRef.current?.disconnect();
    dispatch(logOut());
  }

  function createNewRoom(e: any) {
    // const formData = new FormData(e.target);
    // const value = formData.get("name")?.toString().trim()!;

    // console.log("value", value);
    const value = inputNewRoomRef.current?.value.trim();
    socketRef.current?.emit("createNewRoom", value, (data: any) => {
      console.log("Response from server: ", data);
    });
    e.preventDefault();
  }

  return (
    <Page>
      <RouteColumn>
        <p>DashboardScreen</p>
        {roomsList.map(({ name }, i) => (
          <div key={i}>
            <Link to={name}> go to {name}</Link>
          </div>
        ))}
        <form onSubmit={createNewRoom}>
          <input
            type="text"
            placeholder="new room name"
            name="name"
            ref={inputNewRoomRef}
          />
          <button type="submit">Create New Room</button>
        </form>

        <br />
        <br />
        <button onClick={doLogOut}>LogOut</button>
        <div>
          {activeUsers.map((user) => (
            <p key={user.socketID}>
              {user.name} {user.isTyping && "is typing"}
            </p>
          ))}
        </div>
      </RouteColumn>
      <OutletColum>
        <Outlet context={socketRef.current} />
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
  border-right: #24292e 8px dashed;
`;

const OutletColum = styled.div`
  flex: 1 auto;
`;
