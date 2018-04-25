"use strict";

const mongoose = require("mongoose");
const config = require("../config/app");

mongoose.connect(config.database);

const Order = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      required: true
    },
    bankName: {
      type: String,
      required: true
    },
    bankAccount: {
      type: String,
      required: true
    },
    bankPerson: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", Order);
