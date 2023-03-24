// testing mongoDB commands
require("dotenv").config();
const mongoose = require("mongoose");
const Room = require("./models/rooms");
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(async () => {
    console.log("connected === === ===");
    // const result = await Room.aggregate([
    //   { $match: { name: "general" } },
    //   { $project: { messages: 1, total: { $size: "$messages" } } },
    // { $unwind: "$messages" },
    // { $skip: 5 },
    // { $limit: 2 },

    // {
    //   $group: {
    //     _id: null,
    //     messages: { $push: "$messages" },
    //     // total: { $size: "$messages" },
    //   },
    // },

    // occurances: {$push: {'user': '$_id', count: '$count'}}
    // { $slice: ["$messages", 0, 2] },
    // ]);

    const result = await Room.find(
      { name: "general" },
      {
        messages: { $slice: [-2, 2] },
        total: { $size: "$messages" },
      }
    );

    console.log(result.length);
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
