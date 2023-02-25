import styled from "styled-components";
import { ICommentsArray } from "../../types/chatTypes";
import CommentItem from "./ChatItem";

interface IProps {
  allComments: ICommentsArray;
}

const ChatList: React.FC<IProps> = ({ allComments }) => {
  return (
    <CommentList>
      {allComments.map((item, i) => (
        <CommentItem item={item} key={i} />
      ))}
    </CommentList>
  );
};

export default ChatList;

const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
`;
