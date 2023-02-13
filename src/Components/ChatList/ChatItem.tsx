import { IComment } from "../../types/chatTypes";

const ChatItem = ({ item }: { item: IComment }) => {
  return (
    <>
      <h3>name: {item.name}</h3>
      <p>date: {item.date}</p>
      <p>comment: {item.text}</p>
    </>
  );
};

export default ChatItem;
