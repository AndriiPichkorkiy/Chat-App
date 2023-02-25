const jwt = require("jsonwebtoken");

function handshake(socket, next) {
  const { token } = socket.handshake.query;
  if (token) {
    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenVerify) next(new Error("not valid token"));
    next();
  } else {
    next(new Error("token error"));
  }
}

module.exports = handshake;
