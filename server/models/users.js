const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  verificationToken: { type: String, require: true },
  verify: { type: Boolean, default: false },
});

const User = mongoose.model("user", userSchema);
module.exports = { User, userSchema };
