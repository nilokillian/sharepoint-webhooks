const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
//require("./startup/config")();
require("./startup/routes")(app);

const port = process.env.PORT || 1337;
app.listen(port, () => winston.info(`port ${port} is being listened`));
