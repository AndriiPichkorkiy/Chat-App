import { useEffect } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { IComment } from "../../types/chatTypes";

interface IProps {
  socket: Socket;
  msg: string;
  setMsg: React.Dispatch<React.SetStateAction<string>>;
  onSubmit(e: React.FormEvent): void;
  isEditing: null | IComment;
}

const ChatInput: React.FC<IProps> = ({
  socket,
  msg,
  setMsg,
  onSubmit,
  isEditing,
}) => {
  function handlerInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target;
    setMsg(value);
  }

  function handleTyping() {
    socket.emit("typing", true);
  }

  useEffect(() => {
    if (!msg) socket.emit("typing", false);
  }, [msg]);

  return (
    // <>
    <FormContainer onSubmit={onSubmit}>
      <Input
        placeholder="start here..."
        value={msg}
        onChange={handlerInput}
        onKeyDown={handleTyping}
        rows={4}
      />
      <Btn type="submit">{isEditing ? "Edit" : "Send"}</Btn>
    </FormContainer>
    // </>
  );
};

export default ChatInput;

const FormContainer = styled.form`
  display: flex;
  flex-direction: row;
  padding: 8px;
  border-radius: 16px;
  background-color: white;
  height: 100%;
`;

const Input = styled.textarea`
  width: 100%;
  /* height: 100%; */
  resize: none;
  padding: 4px;
  border: none;
  &:focus {
    outline-color: orange;
  }
`;

const Btn = styled.button`
  width: 48px;
  height: 100%;
  margin-top: 0px;
  margin-bottom: -16px;
`;
