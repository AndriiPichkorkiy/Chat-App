const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const Msg = require("./models/messages");

const app = express();

const http = require("http").Server(app);
const cors = require("cors");
const authRouter = require("./routes/api/auth");
const handshake = require("./middlewares/socketHandshake");
const User = require("./models/users");
const Room = require("./models/rooms");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(morgan("short"));
app.use(cors());
app.use(express.json());

let users = [];
socketIO.use(handshake).on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("message", async (data) => {
    const { token } = socket.handshake.query;
    const { _id } = jwt.decode(token);
    const room = await Room.findOne({ name: data.room });

    const newMessage = {
      text: data.text,
      name: data.name,
      id: `${socket.id}${Math.random()}`,
      date: Date.now(),
      owner: _id,
    };
    const subDoc = room.messages.create(newMessage);
    room.messages.push(subDoc);
    await room.save();

    // const response = await Msg.create(newMessage);
    socketIO.to(data.room).emit("messageResponse", subDoc);
  });

  socket.on("messageEdit", async (data) => {
    const { token } = socket.handshake.query;
    const { _id } = jwt.decode(token);
    const room = await Room.findOne({ name: data.room });
    const messageFromDB = room.messages.id(data._id);
    console.log("messageFromDB", messageFromDB);
    if (!messageFromDB || !messageFromDB.owner.equals(_id)) {
      return { error: "NO PERMITIONS!" };
    }
    // if (!messageFromDB.owner.equals(_id)) {
    //   // const messageFromDB = await room.messages.findById(data._id);

    //   return { error: "NO PERMITIONS!" };
    // }

    // const newMessage = {
    //   text: data.text,
    //   date: Date.now(),
    // };

    messageFromDB.text = data.text;
    messageFromDB.date = Date.now();
    room.markModified("messages");
    room.save(function (saveerr, saveResult) {
      if (!saveerr) {
        // console.log("saveResult", saveResult);
        const response = saveResult.messages.id(data._id); // 200
        socketIO.to(data.room).emit("messageWasEdited", response);
      } else {
        // console.log("saveerr", saveerr); // 400
      }
    });
    // const response = await Msg.findByIdAndUpdate(data._id, newMessage, {
    //   returnDocument: "after",
    // });

    // socketIO.to(data.room).emit("messageWasEdited", response);
  });

  socket.on("join room", async ({ room: roomName }) => {
    socket.join(roomName);
    const room = await Room.findOne({ name: roomName });

    // Msg.find().then((response) => socket.emit("enterChat", response));
    socket.emit("enterChat", room.messages);
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

app.get("/chat/activeUsers", (req, res) => res.json(users));
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = http;
