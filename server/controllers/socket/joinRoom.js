const Room = require("../../models/rooms");

const joinRoom = async function ({ room: roomName }, socket) {
  socket.join(roomName);

  const response = await Room.findOne(
    { name: roomName },
    {
      messages: { $slice: [-5, 5] },
      total: { $size: "$messages" },
    }
  );

  socket.emit("enterChat", response);
};

module.exports = joinRoom;
