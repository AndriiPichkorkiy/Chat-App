// import { msgSchema } from "./messages";
const { msgSchema } = require("./messages");

const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  messages: {
    type: [msgSchema],
    default: [],
  },
});

const Room = mongoose.model("rooms", roomSchema);
module.exports = Room;
