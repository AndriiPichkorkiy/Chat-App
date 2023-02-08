import { IComment } from "../../types/chatTypes";

const CommentItem = ({ item }: { item: IComment }) => {
  return (
    <>
      <h3>name: {item.name}</h3>
      <p>date: {item.date}</p>
      <p>comment: {item.comment}</p>
    </>
  );
};

export default CommentItem;
