import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { getName } from "../../redux/auth/auth-selectors";
import { useAppSelector } from "../../redux/reduxTsHooks";

const ChantInput: React.FC<{ socket: Socket }> = ({ socket }) => {
  const [msg, setMsg] = useState<string>("");
  const useName = useAppSelector(getName);

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

  function submitMsg(e: React.FormEvent) {
    e.preventDefault();
    let message = msg.trim();
    if (message) {
      socket.emit("message", {
        text: message,
        name: useName,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        date: Date.now(),
      });
    }
    setMsg("");
  }

  return (
    <>
      <FormContainer onSubmit={submitMsg}>
        <Input
          placeholder="start here..."
          value={msg}
          onChange={handlerInput}
          onKeyDown={handleTyping}
          rows={4}
        />
        <Btn type="submit">Send</Btn>
      </FormContainer>
    </>
  );
};

export default ChantInput;

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
