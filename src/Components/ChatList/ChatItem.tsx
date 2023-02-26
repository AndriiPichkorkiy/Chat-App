import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { copyTextToClipboard } from "../../helpers/copyTextToClipboard";
import { getAuthId } from "../../redux/auth/auth-selectors";
import { useAppSelector } from "../../redux/reduxTsHooks";
import { IComment } from "../../types/chatTypes";
import { ContextMenuType } from "../../types/contextTypes";
import { MenuContext } from "../ContextMenu/ContextMenu";

const ChatItem = ({ item }: { item: IComment }) => {
  const [isSelected, setIsSelected] = useState(false);
  const { setCoords } = useContext(MenuContext) as ContextMenuType;
  const _id = useAppSelector(getAuthId);
  const dateFull = new Date(item.date).toLocaleDateString();
  const isOwn = item.owner === _id;

  const contextMenuHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSelected(true);
    const { clientX: x, clientY: y } = e;

    setCoords({
      x,
      y,
      isShown: true,
      onClose: () => setIsSelected(false),
      options: constextMenuOptions,
    });
  };

  const constextMenuOptions = [
    {
      title: "copy",
      fun: () => {
        console.log("click");
        copyTextToClipboard(item.text);
      },
    },
    {
      title: "title bla bla bla",
      fun: () => {
        copyTextToClipboard(item.text);
      },
    },
  ];

  // const contextMenuOnClose = () => {
  //   setIsSelected(false);
  //   console.log("isSelected", isSelected);
  // };

  return (
    <Li
      isSelected={isSelected}
      onContextMenu={contextMenuHandler}
      onClick={() => setIsSelected(false)}
    >
      <ItemContainer isOwn={isOwn}>
        <NameElement>{item.name}</NameElement>

        <p>{item.text}</p>
        <DateElement>{dateFull}</DateElement>
      </ItemContainer>
    </Li>
  );
};

export default ChatItem;

/////////////
// styles //
///////////

interface ILi {
  isSelected: boolean;
}

interface IContainer {
  isOwn: boolean;
}

const Li = styled.li<ILi>`
  display: flex;
  background: ${({ isSelected }) => {
    return isSelected ? "#FFFFFF55" : "unset";
  }};
`;

const ItemContainer = styled.div<IContainer>`
  border-radius: 8px;
  background-color: white;
  width: fit-content;
  max-width: 50%;
  color: black;
  margin: 16px;
  padding: 8px;
  align-self: ${({ isOwn }) => {
    return isOwn ? "end" : "start";
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
