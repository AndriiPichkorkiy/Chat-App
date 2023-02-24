const RequestError = require("../../helpers/RequestError");
const User = require("../../models/users");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

async function registration(req, res) {
  const { email, name, password } = req.body;

  const user = await User.findOne({ email }, { email: true });

  if (user) throw RequestError(401, "email in use");

  const hashedPassword = await bcrypt.hash(password, 9);
  const verificationToken = crypto.randomBytes(16).toString("hex");

  const result = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
  });

  res.json({
    user: {
      name: result.name,
      email: result.email,
    },
  });
}

module.exports = registration;
