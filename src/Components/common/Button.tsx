import { StyleHTMLAttributes } from "react";
import styled from "styled-components";

const Button: React.FC<{
  title: string;
  onClick: () => void;
  style: React.CSSProperties;
}> = ({ title, onClick, style }) => {
  return (
    <ButtonElement style={style} onClick={onClick}>
      {title}
    </ButtonElement>
  );
};

export default Button;

const ButtonElement = styled.button``;
