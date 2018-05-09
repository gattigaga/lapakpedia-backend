"use strict";

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const compression = require("compression");
const { ExtractJwt, Strategy } = require("passport-jwt");
const path = require("path");

const config = require("./src/config/app");
const routes = require("./src/config/routes");
const User = require("./src/models/user");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret
};

const strategy = new Strategy(jwtOptions, (payload, next) => {
  User.findOne({ _id: payload._id }, (err, user) => {
    if (user) {
      next(err, user);
    } else {
      next(err, false);
    }
  });
});

passport.use(strategy);

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.use(compression());
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));

routes(app);

module.exports = app;
