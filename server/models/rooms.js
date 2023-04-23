// import { msgSchema } from "./messages";
const { msgSchema } = require("./messages");

const mongoose = require("mongoose");
const { userSchema } = require("./users");

const roomSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  messages: {
    type: [msgSchema],
    default: [],
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  members: [userSchema],
  waitingMembers: [userSchema],
});

const Room = mongoose.model("rooms", roomSchema);
module.exports = Room;
