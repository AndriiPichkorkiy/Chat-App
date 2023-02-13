import ChatList from "../Components/ChatList/ChatList";
import { useEffect, useState } from "react";
import { fetchComments } from "../redux/chat/chat-operations";
import { useAppDispatch, useAppSelector } from "../redux/reduxTsHooks";
import { IActiveUserArray, IComment, ICommentsArray } from "../types/chatTypes";
import ChantInput from "../Components/ChatInput/ChantInput";
import socket from "../api/socket";
import { addComment } from "../redux/chat/chat-slice";
import { api } from "../api/fetch";

const ChatScreen = () => {
  const [allComments, setAllComments] = useState<ICommentsArray>([]);
  const [activeUsers, setActiveUsers] = useState<IActiveUserArray>([]);
  const dispath = useAppDispatch();
  const [typingStatus, setTypingStatus] = useState<string>("");

  const { isLoading, error, items } = useAppSelector((state) => state.chat);

  useEffect(() => {
    refreshComments();
    api
      .getActiveUsers()
      .then((response) => {
        if (typeof response === "object") setActiveUsers(response);
      })
      .catch(console.log);
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
    socket.on("messageResponse", listenNewMsg);

    return () => {
      socket.off("messageResponse", listenNewMsg);
    };
  }, []);

  useEffect(() => {
    socket.on("newUserResponse", (data) => {
      console.log("newUserResponse", data);
      setActiveUsers(data);
    });
  }, []);

  function refreshComments() {
    dispath(fetchComments());
  }

  if (isLoading) return <p>Is Loading...</p>;
  return (
    <>
      <h2>DashboardScreen</h2>
      <button onClick={refreshComments}>refresh</button>
      {activeUsers.map((user) => (
        <p key={user.socketID}>
          {user.name} {user.isTyping && "is typing"}
        </p>
      ))}
      {typingStatus && <p>{typingStatus}</p>}
      {/* commentList */}
      <ChatList allComments={allComments} />
      {/* textInput */}
      <ChantInput />
    </>
  );
};

export default ChatScreen;