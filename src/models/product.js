"use strict";

const mongoose = require("mongoose");
const config = require("../config/app");

mongoose.connect(config.database);

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    totalViews: {
      type: Number,
      default: 0
    },
    photo: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", Product);
