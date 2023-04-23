const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const Msg = require("./models/messages");

const app = express();

const http = require("http").Server(app);
const cors = require("cors");
const authRouter = require("./routes/api/auth");
const handshake = require("./middlewares/socketHandshake");
const { User } = require("./models/users");
const Room = require("./models/rooms");
const { joinRoom, getPrevious } = require("./controllers/socket");
const socketCtrlWrapper = require("./helpers/socketCtrlWrapper");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(morgan("short"));
app.use(cors());
app.use(express.json());

let users = [];
let allUsers = [];
let rooms = [];

const promise1 = User.find({}, { name: 1 }).then((data) => {
  allUsers = data;
});

const promise2 = Room.find({}).then((data) => {
  rooms = data;
});

async function fetchRooms() {
  await Room.find({}, { name: 1, members: 1, waitingMembers: 1 }).then(
    (data) => {
      rooms = data;
    }
  );
}

Promise.all([promise1, promise2]).then(socketInit);

function socketInit() {
  socketIO.use(handshake).on("connection", async (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    users.push(socket.socketUser);

    socketIO.emit("newUserResponse", { users, allUsers, rooms });

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

    socket.on("getPrevious", socketCtrlWrapper(getPrevious, socket));

    socket.on("messageEdit", async (data) => {
      const { token } = socket.handshake.query;
      const { _id } = jwt.decode(token);
      const room = await Room.findOne({ name: data.room });
      const messageFromDB = room.messages.id(data._id);

      if (!messageFromDB || !messageFromDB.owner.equals(_id)) {
        return { error: "NO PERMITIONS!" };
      }

      messageFromDB.text = data.text;
      messageFromDB.date = Date.now();
      room.markModified("messages");
      room.save(function (saveerr, saveResult) {
        if (!saveerr) {
          const response = saveResult.messages.id(data._id); // 200
          socketIO.to(data.room).emit("messageWasEdited", response);
        } else {
          // console.log("saveerr", saveerr); // 400
        }
      });
    });

    socket.on("join room", socketCtrlWrapper(joinRoom, socket));

    socket.on("newUser", (data) => {
      users.push(data);
      socketIO.emit("newUserResponse", { users, allUsers, rooms });
    });

    socket.on("typing", (status) => {
      const index = users.findIndex((user) => {
        return user.socketID === socket.id;
      });
      if (index === -1) return console.warn("users: ", users);
      users[index].isTyping = status;
      socketIO.emit("newUserResponse", { users, allUsers, rooms });
    });

    socket.on("createNewRoom", async (roomName, cb) => {
      const { token } = socket.handshake.query;
      const { _id } = jwt.decode(token);
      const room = {
        name: roomName,
        owner: _id,
      };
      Room.create(room)
        .then(cb)
        .catch((error) => cb({ error }));

      await fetchRooms();
      socketIO.emit("newUserResponse", { users, allUsers, rooms });
    });

    socket.on("add member", async ({ roomName, memberId }, cb) => {
      const { token } = socket.handshake.query;
      const { _id } = jwt.decode(token);

      const room = await Room.findOne({ name: roomName });
      if (room.owner._id.equals(_id)) return { error: true };

      room.members.push(memberId);
      await room.save();
      // updateRooms();
      cb("success, " + memberId + ", " + roomName);
    });

    socket.on("join request", async (roomName, cb) => {
      console.log("begin join request");
      const { token } = socket.handshake.query;
      const { _id, name } = jwt.decode(token);

      // const room = await Room.findOne({ name: roomName });
      await Room.findOneAndUpdate(
        { name: roomName },
        { $push: { waitingMembers: { name, _id } } }
      );
      // if (room.owner._id.equals(_id)) return { error: true };

      // room.members.push(memberId);
      // await room.save();
      // cb("success, " + memberId + ", " + roomName);
      console.log(roomName + ", " + name + " did join request");
      await fetchRooms();
      socketIO.emit("newUserResponse", { users, allUsers, rooms });
    });

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
      users = users.filter((user) => user.socketID !== socket.id);
      socketIO.emit("newUserResponse", { users, allUsers, rooms });
      socket.disconnect();
    });
  });
}

app.get("/users", (req, res) => res.json(users));
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = http;
