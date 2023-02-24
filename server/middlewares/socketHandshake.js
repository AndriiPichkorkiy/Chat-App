const jwt = require("jsonwebtoken");

function handshake(socket, next) {
  if (socket.handshake.query?.token) {
    const { token } = socket.handshake.query;
    const tokenDecoded = jwt.decode(token, process.env.JWT_SECRET);
    if (tokenDecoded) next(new Error("not valid token"));
    next();
    // jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
    //   if (err) return next(new Error('Authentication error'));
    //   socket.decoded = decoded;
    //   next();
  } else {
    next(new Error("token error"));
  }
}

module.exports = handshake;
