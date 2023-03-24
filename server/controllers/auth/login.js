const RequestError = require("../../helpers/RequestError");
const User = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log("user:", user);
  if (!user) throw RequestError(401, "wrong email");

  if (!bcrypt.compare(password, user.password))
    throw RequestError(403, "wrong email");

  const token = jwt.sign(
    { _id: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    message: "Success login!",
    user: {
      name: user.name,
      email: user.email,
      token: token,
      _id: user._id,
    },
  });
}

module.exports = login;
