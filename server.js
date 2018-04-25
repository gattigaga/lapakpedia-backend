"use strict";

const config = require("./src/config/app");
const app = require("./app");
const port = process.env.PORT || config.port;

app.listen(port);

console.log("Server started on: " + port);
