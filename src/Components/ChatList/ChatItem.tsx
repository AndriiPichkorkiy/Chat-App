import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { copyTextToClipboard } from "../../helpers/copyTextToClipboard";
import { getAuthId } from "../../redux/auth/auth-selectors";
import { useAppSelector } from "../../redux/reduxTsHooks";
import { IComment } from "../../types/chatTypes";
import { ContextMenuType } from "../../types/contextTypes";
import { MenuContext } from "../ContextMenu/ContextMenu";

interface IProps {
  item: IComment;
  editMsg: (comment: IComment) => void;
}

const ChatItem: React.FC<IProps> = ({ item, editMsg }) => {
  const [isSelected, setIsSelected] = useState(false);
  const { setCoords } = useContext(MenuContext) as ContextMenuType;
  const _id = useAppSelector(getAuthId);
  const dateFull = new Date(item.date).toLocaleDateString();
  const isOwn = item.owner === _id;

  // console.log("isOwn", isOwn);

  const contextMenuHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSelected(true);
    const { clientX: x, clientY: y } = e;

    setCoords({
      x,
      y,
      isShown: true,
      onClose: () => setIsSelected(false),
      options: getConstextMenuOptions(),
    });
  };

  function getConstextMenuOptions() {
    return [
      {
        title: "copy",
        fun: () => {
          console.log("click");
          copyTextToClipboard(item.text);
        },
      },
      {
        title: "edit",
        fun: () => {
          editMsg(item);
          console.log(item);
        },
      },
    ];
  }

  // const contextMenuOnClose = () => {
  //   setIsSelected(false);
  //   console.log("isSelected", isSelected);
  // };

  return (
    <Li
      isSelected={isSelected}
      isOwn={isOwn}
      onContextMenu={contextMenuHandler}
      onClick={() => setIsSelected(false)}
    >
      <ItemContainer>
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
  isOwn: boolean;
}

const Li = styled.li<ILi>`
  display: flex;
  background: ${({ isSelected }) => {
    return isSelected ? "#FFFFFF55" : "unset";
  }};

  flex-direction: ${({ isOwn }) => {
    return isOwn ? "row-reverse" : "row";
  }};
`;

//row-reverse;

const ItemContainer = styled.div`
  border-radius: 8px;
  background-color: white;
  width: fit-content;
  max-width: 50%;
  color: black;
  margin: 16px;
  padding: 8px;
`;

const NameElement = styled.span`
  font-size: 1.2rem;
  color: orange;
`;

const DateElement = styled.span`
  font-size: 0.8rem;
  color: darkgrey;
`;
