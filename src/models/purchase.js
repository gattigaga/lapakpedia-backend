"use strict";

const mongoose = require("mongoose");
const config = require("../config/app");

mongoose.connect(config.database);

const Purchase = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    totalPrices: {
      type: Number,
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    review: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Purchase", Purchase);
