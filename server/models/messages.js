const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema({
  text: { type: String, require: true },
  name: { type: String, require: true },
  id: { type: String, require: true },
  date: { type: Number, require: true },
  owner: { type: mongoose.ObjectId, require: true },
});

const Msg = mongoose.model("msg", msgSchema);
module.exports = Msg;
