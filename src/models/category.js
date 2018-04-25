"use strict";

const mongoose = require("mongoose");
const config = require("../config/app");

mongoose.connect(config.database);

const Category = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Category", Category);
