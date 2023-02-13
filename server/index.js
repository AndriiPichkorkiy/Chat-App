const express = require("express");
const app = express();
const PORT = 4000;
const morgan = require("morgan");

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
    socketIO.emit("messageResponse", data);
    // socket.broadcast.emit("messageResponse", data);
  });

  // socket.on("getActiveUsers", () => {
  //   socket.emit("");
  // });

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on("typing", (status) => {
    const index = users.findIndex((user) => {
      // console.log(user.socketID, socket.id, user.socketID === socket.id);
      return user.socketID === socket.id;
    });
    if (index === -1) return console.warn(users);
    users[index].isTyping = status;
    socketIO.emit("newUserResponse", users);
    // socket.broadcast.emit("typingResponse", data);
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
  // res.json({
  //   message: "Hello world",
  // });
  res.json(users);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
