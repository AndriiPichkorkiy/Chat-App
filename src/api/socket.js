import socketIO, { io } from "socket.io-client";
const WEB_ADRESS = "http://localhost:4000";

// const socket = io(WEB_ADRESS);
const socketObj = {
  socket: null,
  getSocket: function () {
    if (this.socket === null) {
      this.setSocket();
    }
    if (this.socket !== null) return this.socket;
  },
  setSocket: function (token) {
    this.socket = io(WEB_ADRESS, { token });
  },
};

console.log("Socket io");

export default socketObj;
