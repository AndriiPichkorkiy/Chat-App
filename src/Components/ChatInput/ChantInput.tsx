import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getName } from "../../redux/auth/auth-selectors";
import { useAppSelector } from "../../redux/reduxTsHooks";

const ChantInput: React.FC<{ socket: Socket }> = ({ socket }) => {
  const [msg, setMsg] = useState<string>("");
  const useName = useAppSelector(getName);

  function handlerInput(e: React.ChangeEvent<HTMLInputElement>) {
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
      <form onSubmit={submitMsg}>
        <input
          type="text"
          placeholder="start here..."
          value={msg}
          onChange={handlerInput}
          onKeyDown={handleTyping}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
};

export default ChantInput;
