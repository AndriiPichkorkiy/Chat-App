const jwt = require("jsonwebtoken");

function handshake(socket, next) {
  const { token } = socket.handshake.query;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      const { name } = jwt.decode(token);
      socket.socketUser = { name, socketID: socket.id };
      next();
    } catch (error) {
      console.log("catch error", error.message);
      next(new Error("not valid token"));
    }
  } else {
    next(new Error("no token"));
  }
}

module.exports = handshake;
