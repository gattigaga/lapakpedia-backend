"use strict";

const Order = require("../models/order");

exports.index = async (req, res) => {
  const {
    memberID,
    sortable = "createdAt",
    sortBy = "asc",
    skip = 0,
    take = Order.count()
  } = req.query;
  const query = {};

  if (memberID) {
    query.member = memberID;
  }

  try {
    const orders = await Order.find(query)
      .sort(`${sortBy === "desc" ? "-" : ""}${sortable}`)
      .skip(Number(skip))
      .limit(Number(take))
      .exec();

    res.send(orders);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving orders"
    });
  }
};

exports.create = async (req, res) => {
  const { body } = req;
  const newOrder = new Order(body);

  try {
    const order = await newOrder.save();
    res.send(order);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error occurred while creating order"
    });
  }
};

exports.read = async (req, res) => {
  const { params } = req;

  try {
    const order = await Order.findById(params.id);

    if (!order) {
      return res.status(404).send({
        message: "Order not found"
      });
    }

    res.send(order);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Order not found"
      });
    }

    return res.status(500).send({
      message: "Error retrieving order"
    });
  }
};

exports.update = async (req, res) => {
  const { body, params } = req;

  try {
    const order = await Order.findOneAndUpdate({ _id: params.id }, body, {
      new: true
    });

    if (!order) {
      return res.status(404).send({
        message: "Order not found"
      });
    }

    res.send(order);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Order not found"
      });
    }

    return res.status(500).send({
      message: "Error finding order"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const order = await Order.remove({ _id: params.id });

    if (!order) {
      return res.status(404).send({
        message: "Order not found"
      });
    }

    res.send({ message: "Order deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Order not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete order"
    });
  }
};
