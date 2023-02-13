import { ICommentsArray } from "../../types/chatTypes";
import CommentItem from "./ChatItem";

interface IProps {
  allComments: ICommentsArray;
}

const ChatList: React.FC<IProps> = ({ allComments }) => {
  return (
    <ul>
      {allComments.map((item, i) => (
        <div key={i}>
          <CommentItem item={item} />
        </div>
      ))}
    </ul>
  );
};

export default ChatList;
