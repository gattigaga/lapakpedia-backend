"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config/app");

mongoose.connect(config.database);

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    photo: {
      type: String
    },
    role: {
      type: String,
      enum: ["MEMBER", "SELLER", "ADMIN"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Hashing password before saved
User.pre("save", function(next) {
  const user = this;
  const saltRounds = 10;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", User);
