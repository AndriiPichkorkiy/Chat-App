import ChatList from "../Components/ChatList/ChatList";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/reduxTsHooks";
import { IActiveUserArray, IComment, ICommentsArray } from "../types/chatTypes";
import ChatInput from "../Components/ChatInput/ChatInput";
import {
  addComment,
  addComments,
  changeEditedComment,
  addPreviousComments,
} from "../redux/chat/chat-slice";
import { api } from "../api/fetch";
import { io, Socket } from "socket.io-client";
import { getAuthId, getName, getToken } from "../redux/auth/auth-selectors";
import styled from "styled-components";
import { useOutletContext, useParams } from "react-router-dom";
// const WEB_ADRESS = "http://localhost:4000";

const ChatScreen: React.FC = () => {
  const room: string = useParams().roomName!;
  // const [isJoined, setIsJoined] = useState("pending");

  const _id = useAppSelector(getAuthId);

  const socket = useOutletContext<Socket>();
  const [allComments, setAllComments] = useState<ICommentsArray>([]);

  const dispath = useAppDispatch();

  const [pagination, setPagination] = useState({
    total: 0,
    cursor: 0,
    limit: 5,
    defLimit: 5,
  });

  const getPrevious = async () => {
    socket.emit(
      "getPrevious",
      {
        room,
        from: pagination.cursor,
        limit: pagination.limit,
      },
      (response: { messages: ICommentsArray; total: number }) => {
        setPagination((prev) => ({ ...prev, cursor: prev.cursor - 5 }));
        dispath(addPreviousComments(response.messages));
      }
    );
  };

  const { isLoading, items } = useAppSelector((state) => state.chat);

  useEffect(() => {
    socket.emit("join room", { room }, (response: any) => {
      if (response.error) {
        // setIsJoined("reject");
      } else {
        getPreMsgs(response);
      }
    });
  }, [room]);

  useEffect(() => {
    setAllComments(items);
  }, [items]);

  useEffect(() => {
    const listenNewMsg = (data: IComment) => dispath(addComment(data));

    const handlerMessageWasEdited = (data: IComment) => {
      dispath(changeEditedComment(data));
    };
    socket.on("messageResponse", listenNewMsg);
    socket.on("messageWasEdited", handlerMessageWasEdited);
    return () => {
      socket.off("messageResponse", listenNewMsg);
      socket.off("messageWasEdited", handlerMessageWasEdited);
    };
  }, [room]);

  const getPreMsgs = (data: {
    messages: ICommentsArray;
    total: number;
    members: IActiveUserArray;
    waitingMembers: IActiveUserArray;
  }) => {
    console.log("getPreMsgs data", data);
    dispath(addComments(data.messages));

    setPagination((prev) => {
      let cursor;
      let limit = 5;

      if (data.total <= 5) {
        cursor = -1;
      } else {
        cursor = data.total - prev.defLimit * 2;
        if (cursor < 0) {
          limit = cursor + prev.defLimit;
          cursor = 0;
        }
      }

      return {
        ...prev,
        cursor,
        limit,
        total: data.total,
      };
    });
  };

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

  // function sendRequest() {
  //   console.log("sending");
  //   socket.emit("join request", room);
  // }

  if (isLoading) return <p>Is Loading...</p>;
  // if (isJoined === "reject")
  //   return (
  //     <Container>
  //       <Header>
  //         <h2>Send request to join a chat</h2>
  //         <button onClick={sendRequest}>Send request</button>
  //       </Header>
  //     </Container>
  //   );

  return (
    <Container>
      <Header>
        <h2>ChatScreen</h2>
      </Header>

      <Main>
        {pagination.cursor < 0 ? null : (
          <button onClick={getPrevious}>
            upload messages from
            <b> {pagination.cursor} </b>
            to
            <b> {pagination.cursor + pagination.limit} </b>
          </button>
        )}
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
