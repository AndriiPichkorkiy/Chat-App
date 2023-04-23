const Room = require("../../models/rooms");
// const jwt = require("jsonwebtoken");

const joinRoom = async function ({ room: roomName }, socket, cb) {
  // const { token } = socket.handshake.query;
  // const { _id } = jwt.decode(token);

  const previousRoom = Array.from(socket.rooms)[1];
  if (previousRoom) socket.leave(previousRoom);

  const response = await Room.findOne(
    { name: roomName },
    {
      messages: { $slice: [-5, 5] },
      total: { $size: "$messages" },
      owner: 1,
      members: 1,
      waitingMembers: 1,
    }
  );

  // if (response.owner.toString() === _id || response.members.includes(_id)) {
  //   socket.join(roomName);
  //   cb(response);
  // } else {
  //   cb({
  //     error: {
  //       message: "no permissions",
  //     },
  //   });
  // }

  socket.join(roomName);
  cb(response);
};

module.exports = joinRoom;
