require("dotenv").config();
const mongoose = require("mongoose");
const chalk = require("chalk");
const http = require("./app");
const { PORT, DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    http.listen(PORT, (error) => {
      if (error) return console.error(error.message);

      console.log(chalk.cyan.underline(`http://localhost:${PORT}`));
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
