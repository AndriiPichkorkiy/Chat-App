import ChatList from "../Components/ChatList/ChatList";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/reduxTsHooks";
import { IActiveUserArray, IComment, ICommentsArray } from "../types/chatTypes";
import ChantInput from "../Components/ChatInput/ChantInput";
import { addComment, addComments } from "../redux/chat/chat-slice";
import { api } from "../api/fetch";
import { io } from "socket.io-client";
import { getToken } from "../redux/auth/auth-selectors";
const WEB_ADRESS = "http://localhost:4000";

const ChatScreen = () => {
  const [allComments, setAllComments] = useState<ICommentsArray>([]);
  const [activeUsers, setActiveUsers] = useState<IActiveUserArray>([]);
  const dispath = useAppDispatch();
  const [typingStatus, setTypingStatus] = useState<string>("");

  const token = useAppSelector(getToken);
  const [socket] = useState(() =>
    io(WEB_ADRESS, {
      query: { token },
      // "force new connection": true,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ["websocket"],
    })
  );

  const { isLoading, error, items } = useAppSelector((state) => state.chat);

  useEffect(() => {
    api
      .getActiveUsers()
      .then((response) => {
        setActiveUsers(response);
      })
      .catch(console.error);

    socket.emit("enterChat");
  }, []);

  useEffect(() => {
    setAllComments(items);
  }, [items]);

  useEffect(() => {
    const sendTypingStatus = (data: string) => setTypingStatus(data);
    socket.on("typingResponse", sendTypingStatus);

    return () => {
      socket.off("typingResponse", sendTypingStatus);
    };
  }, []);

  useEffect(() => {
    const listenNewMsg = (data: IComment) => dispath(addComment(data));
    const getPreMsgs = (data: ICommentsArray) => dispath(addComments(data));
    socket.on("messageResponse", listenNewMsg);
    socket.on("enterChat", getPreMsgs);
    return () => {
      socket.off("messageResponse", listenNewMsg);
      socket.off("enterChat", getPreMsgs);
    };
  }, []);

  useEffect(() => {
    socket.on("newUserResponse", (data) => {
      console.log("newUserResponse", data);
      setActiveUsers(data);
    });
  }, []);

  if (isLoading) return <p>Is Loading...</p>;
  return (
    <>
      <h2>DashboardScreen</h2>
      {/* <button onClick={refreshComments}>refresh</button> */}
      {activeUsers.map((user) => (
        <p key={user.socketID}>
          {user.name} {user.isTyping && "is typing"}
        </p>
      ))}
      {typingStatus && <p>{typingStatus}</p>}

      <ChatList allComments={allComments} />
      <ChantInput socket={socket} />
    </>
  );
};

export default ChatScreen;
