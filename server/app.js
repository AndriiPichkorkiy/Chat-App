const express = require("express");
const morgan = require("morgan");
const Msg = require("./models/messages");

const app = express();

const http = require("http").Server(app);
const cors = require("cors");
const authRouter = require("./routes/api/auth");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(morgan("short"));
app.use(cors());
app.use(express.json());

let users = [];
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("message", async (data) => {
    const newMessage = {
      text: data.text,
      name: data.name,
      id: data.id,
      date: data.date,
    };

    const response = await Msg.create(newMessage);
    console.log("response", response);
    socketIO.emit("messageResponse", data);
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

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = http;
