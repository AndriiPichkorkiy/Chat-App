import ChatList from "../Components/ChatList/ChatList";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/reduxTsHooks";
import { IActiveUserArray, IComment, ICommentsArray } from "../types/chatTypes";
import ChatInput from "../Components/ChatInput/ChatInput";
import {
  addComment,
  addComments,
  changeEditedComment,
} from "../redux/chat/chat-slice";
import { api } from "../api/fetch";
import { io } from "socket.io-client";
import { getName, getToken } from "../redux/auth/auth-selectors";
import styled from "styled-components";
const WEB_ADRESS = "http://localhost:4000";

interface IChatScreen {
  room: string;
}

const ChatScreen: React.FC<IChatScreen> = ({ room }) => {
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

  const { isLoading, items } = useAppSelector((state) => state.chat);

  useEffect(() => {
    api
      .getActiveUsers()
      .then((response) => {
        setActiveUsers(response);
      })
      .catch(console.error);

    socket.emit("join room", { room });
  }, [room]);

  useEffect(() => {
    setAllComments(items);
  }, [items]);

  useEffect(() => {
    const sendTypingStatus = (data: string) => setTypingStatus(data);
    socket.on("typingResponse", sendTypingStatus);

    return () => {
      socket.off("typingResponse", sendTypingStatus);
    };
  }, [room]);

  useEffect(() => {
    const listenNewMsg = (data: IComment) => dispath(addComment(data));
    const getPreMsgs = (data: ICommentsArray) => dispath(addComments(data));
    const handlerMessageWasEdited = (data: IComment) => {
      console.log("handlerMessageWasEdited data", data);
      dispath(changeEditedComment(data));
    };
    socket.on("messageResponse", listenNewMsg);
    socket.on("enterChat", getPreMsgs);
    socket.on("messageWasEdited", handlerMessageWasEdited);
    return () => {
      socket.off("messageResponse", listenNewMsg);
      socket.off("enterChat", getPreMsgs);
      socket.off("messageWasEdited", handlerMessageWasEdited);
    };
  }, [room]);

  useEffect(() => {
    socket.on("newUserResponse", (data) => {
      console.log("newUserResponse", data);
      setActiveUsers(data);
    });
  }, [room]);

  // input
  const [msg, setMsg] = useState<string>("");
  const [isEditing, setIsEditing] = useState<null | IComment>(null);
  const useName = useAppSelector(getName);

  function submitMsg(e: React.FormEvent) {
    e.preventDefault();
    let message = msg.trim();
    if (!message) return;

    if (isEditing) {
      setIsEditing(null);
      socket.emit("messageEdit", {
        text: message,
        _id: isEditing._id,
        room,
      });
    } else {
      socket.emit("message", {
        text: message,
        name: useName,
        room,
      });
    }

    setMsg("");
  }

  function editMsg(comment: IComment) {
    setMsg(comment.text);
    setIsEditing(comment);
  }

  if (isLoading) return <p>Is Loading...</p>;
  return (
    <Container>
      <Header>
        <h2>ChatScreen</h2>
      </Header>
      <Main>
        {activeUsers.map((user) => (
          <p key={user.socketID}>
            {user.name} {user.isTyping && "is typing"}
          </p>
        ))}
        {typingStatus && <p>{typingStatus}</p>}

        <ChatList allComments={allComments} editMsg={editMsg} />
      </Main>

      <Footer>
        <ChatInput
          msg={msg}
          setMsg={setMsg}
          onSubmit={submitMsg}
          socket={socket}
          isEditing={isEditing}
        />
      </Footer>
    </Container>
  );
};

export default ChatScreen;

/////////////
// styles //
///////////

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  min-height: 100px;
`;
const Main = styled.div`
  flex: 1 100%;
  overflow: auto;
`;

const Footer = styled.div`
  min-height: 100px;
  padding: 8px;
`;
