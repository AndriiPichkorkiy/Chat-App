import { ICommentsArray } from "../../types/chatTypes";
import CommentItem from "./CommentItem";

interface IProps {
  allComments: ICommentsArray;
}

const CommentList: React.FC<IProps> = ({ allComments }) => {
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

export default CommentList;
