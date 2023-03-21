// testing mongoDB commands
require("dotenv").config();
const mongoose = require("mongoose");
const Room = require("./models/rooms");
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(async () => {
    console.log("connected === === ===");
    const result = await Room.aggregate([
      { $match: { name: "general" } },
      { $unwind: "$messages" },
      { $match: { name: "catcatdog" } },
    ]);
    console.log(result.length);
    // result.forEach(console.log);
    // console.log(result);
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
