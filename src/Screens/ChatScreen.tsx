import CommentList from "../Components/CommentList/CommentList";
import { useEffect, useState } from "react";
import { fetchComments } from "../redux/chat/chat-operations";
import { useAppDispatch, useAppSelector } from "../redux/reduxTsHooks";
import { ICommentsArray } from "../types/chatTypes";

const ChatScreen = () => {
  const [allComments, setAllComments] = useState<ICommentsArray>([]);
  const dispath = useAppDispatch();

  const { isLoading, error, items } = useAppSelector((state) => state.chat);

  useEffect(() => {
    refreshComments();
  }, []);

  useEffect(() => {
    setAllComments(items);
  }, [items]);

  function refreshComments() {
    dispath(fetchComments());
  }

  if (isLoading) return <p>Is Loading...</p>;
  return (
    <>
      <h2>DashboardScreen</h2>
      <button onClick={refreshComments}>refresh</button>
      {/* commentList */}
      <CommentList allComments={allComments} />
      {/* textInput */}
    </>
  );
};

export default ChatScreen;
