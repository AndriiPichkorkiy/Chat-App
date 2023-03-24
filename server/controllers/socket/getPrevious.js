const Room = require("../../models/rooms");

const getPrevious = async function (
  { room: roomName, from, limit: queryLimit },
  socket,
  cb
) {
  const skip = from < 0 ? 0 : -1 * from;
  const limit = queryLimit > 5 ? 5 : queryLimit;

  const messages = await Room.findOne(
    { name: roomName },
    {
      messages: { $slice: [skip, limit] },
      total: { $size: "$messages" },
    }
  );
  cb(messages);
};

module.exports = getPrevious;
