import { IComment } from "../../types/chatTypes";

const ChatItem = ({ item }: { item: IComment }) => {
  const date1 = new Date(item.date).toLocaleDateString();
  return (
    <>
      <h3>name: {item.name}</h3>
      <p>date: {date1}</p>
      <p>comment: {item.text}</p>
    </>
  );
};

export default ChatItem;
