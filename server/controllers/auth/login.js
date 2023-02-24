const RequestError = require("../../helpers/RequestError");
const User = require("../../models/users");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log("user:", user);
  if (!user) throw RequestError(401, "wrong email");

  if (!bcrypt.compare(password, user.password))
    throw RequestError(403, "wrong email");

  const verificationToken = crypto.randomBytes(16).toString("hex");

  // const result = {

  // }

  res.json({
    message: "Success!",
    user: {
      subscription: user.subscription,
      email: user.email,
    },
  });
}

module.exports = login;
