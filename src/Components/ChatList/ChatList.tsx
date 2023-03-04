import styled from "styled-components";
import { IComment, ICommentsArray } from "../../types/chatTypes";
import CommentItem from "./ChatItem";

interface IProps {
  allComments: ICommentsArray;
  editMsg: (comment: IComment) => void;
}

const ChatList: React.FC<IProps> = ({ allComments, editMsg }) => {
  return (
    <CommentList>
      {allComments.map((item, i) => (
        <CommentItem item={item} key={i} editMsg={editMsg} />
      ))}
    </CommentList>
  );
};

export default ChatList;

/////////////
// styles //
///////////

const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
`;
