"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/app");

const User = require("../models/user");

// Authenticate a user
exports.login = (req, res) => {
  const { username, email, password } = req.body;
  const authField = username ? "username" : "email";
  const authValue = username || email;

  User.findOne(
    {
      [authField]: authValue
    },
    (err, user) => {
      if (err) {
        console.log(err);

        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "User not found"
          });
        }

        return res.status(500).send({
          message: "Error retrieving user"
        });
      }

      if (!user) {
        return res.status(404).send({
          message: "User not found"
        });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log(err);

          return res.status(401).send({
            message: "Password did not match"
          });
        }

        if (!isMatch) {
          return res.status(401).send({
            message: "Password did not match"
          });
        }

        const payload = { _id: user._id };
        const token = jwt.sign(payload, config.secret);

        res.send({ message: "User successfully authenticated", token });
      });
    }
  );
};

// Get authenticated user
exports.me = (req, res) => {
  res.send(req.user);
};
