import styled from "styled-components";
import { getAuthId } from "../../redux/auth/auth-selectors";
import { useAppSelector } from "../../redux/reduxTsHooks";
import { IComment } from "../../types/chatTypes";

const ChatItem = ({ item }: { item: IComment }) => {
  const _id = useAppSelector(getAuthId);
  const dateFull = new Date(item.date).toLocaleDateString();
  // const direction = { "text-align": item.owner === _id ? "right" : "left" };
  console.log("item.owner", item.owner);
  console.log("_id", _id);
  console.log(item.owner === _id);
  return (
    <ItemContainer direction={item.owner === _id}>
      <NameElement>{item.name}</NameElement>

      <p>{item.text}</p>
      <DateElement>{dateFull}</DateElement>
    </ItemContainer>
  );
};

export default ChatItem;

interface IContainer {
  direction: boolean;
}

const ItemContainer = styled.div<IContainer>`
  border-radius: 8px;
  background-color: white;
  width: fit-content;
  max-width: 50%;
  color: black;
  margin: 16px;
  padding: 8px;
  align-self: ${({ direction }) => {
    return direction ? "end" : "start";
  }};
`;

const NameElement = styled.span`
  font-size: 1.2rem;
  color: orange;
`;

const DateElement = styled.span`
  font-size: 0.8rem;
  color: darkgrey;
`;
