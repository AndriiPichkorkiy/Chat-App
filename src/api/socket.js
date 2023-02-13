import socketIO, { io } from "socket.io-client";
const WEB_ADRESS = "http://localhost:4000";

const socket = io(WEB_ADRESS);

export default socket;
