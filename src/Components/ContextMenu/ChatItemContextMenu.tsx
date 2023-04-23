import { useContext, useEffect } from "react";
import styled from "styled-components";
import { ContextMenuType } from "../../types/contextTypes";
import { MenuContext } from "./ContextMenu";

interface ICoords {
  x: number;
  y: number;
  isShown: boolean;
  onClose: Function | null;
}

const ChatItemContextMenu: React.FC = () => {
  const { coords } = useContext(MenuContext) as ContextMenuType;
  return (
    <Container coords={coords} data-context-menu="true">
      {coords.options.map(({ title, fun }, i) => (
        <button key={i} onMouseDown={fun}>
          {title}
        </button>
      ))}
    </Container>
  );
};

export default ChatItemContextMenu;

const Container = styled.div<{ coords: ICoords }>`
  display: ${({ coords }) => (coords.isShown ? "block" : "none")};
  position: absolute;
  z-index: 100;
  top: ${({ coords }) => coords.y}px;
  left: ${({ coords }) => coords.x}px;
  height: 128px;
  width: 80px;
  background-color: skyblue;
  transition-property: all;
  transition-duration: 250ms;
`;
