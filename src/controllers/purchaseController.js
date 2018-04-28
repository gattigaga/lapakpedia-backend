"use strict";

const Purchase = require("../models/purchase");

exports.index = async (req, res) => {
  const {
    orderID,
    productID,
    sortable = "createdAt",
    sortBy = "asc",
    skip = 0,
    take = Purchase.count()
  } = req.query;
  const query = {};

  if (orderID) query.order = orderID;
  if (productID) query.product = productID;

  try {
    const purchases = await Purchase.find(query)
      .sort(`${sortBy === "desc" ? "-" : ""}${sortable}`)
      .skip(Number(skip))
      .limit(Number(take))
      .exec();

    res.send(purchases);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving purchases"
    });
  }
};

exports.create = async (req, res) => {
  const { body } = req;
  const newPurchase = new Purchase(body);

  try {
    const purchase = await newPurchase.save();
    res.send(purchase);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error occurred while creating purchase"
    });
  }
};

exports.read = async (req, res) => {
  const { params } = req;

  try {
    const purchase = await Purchase.findById(params.id);

    if (!purchase) {
      return res.status(404).send({
        message: "Purchase not found"
      });
    }

    res.send(purchase);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Purchase not found"
      });
    }

    return res.status(500).send({
      message: "Error retrieving purchase"
    });
  }
};

exports.update = async (req, res) => {
  const { body, params } = req;

  try {
    const purchase = await Purchase.findOneAndUpdate({ _id: params.id }, body, {
      new: true
    });

    if (!purchase) {
      return res.status(404).send({
        message: "Purchase not found"
      });
    }

    res.send(purchase);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Purchase not found"
      });
    }

    return res.status(500).send({
      message: "Error finding purchase"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const purchase = await Purchase.remove({ _id: params.id });

    if (!purchase) {
      return res.status(404).send({
        message: "Purchase not found"
      });
    }

    res.send({ message: "Purchase deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Purchase not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete purchase"
    });
  }
};
