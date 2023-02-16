const express = require("express");
const morgan = require("morgan");
const Msg = require("./models/messages");

const app = express();

const http = require("http").Server(app);
const cors = require("cors");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(morgan("combined"));
app.use(cors());

let users = [];
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("message", (data) => {
    const newMessage = { ...data };
    delete newMessage.socketID;
    const msg = new Msg(newMessage);
    msg.save().then(() => {
      socketIO.emit("messageResponse", data);
    });
  });

  socket.on("enterChat", () => {
    Msg.find().then((response) => {
      socket.emit("enterChat", response);
    });
  });

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on("typing", (status) => {
    const index = users.findIndex((user) => {
      return user.socketID === socket.id;
    });
    if (index === -1) return console.warn("users: ", users);
    users[index].isTyping = status;
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});
app.get("/chat/activeUsers", (req, res) => {
  res.json(users);
});

module.exports = http;
