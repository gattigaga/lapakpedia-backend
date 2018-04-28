"use strict";

const path = require("path");
const fs = require("fs");

const Product = require("../models/product");

exports.index = async (req, res) => {
  const {
    sellerID,
    categoryID,
    name = "",
    sortable = "createdAt",
    sortBy = "asc",
    skip = 0,
    take = Product.count(),
    price
  } = req.query;
  const query = {
    name: new RegExp(name, "i")
  };

  if (sellerID) query.seller = sellerID;
  if (categoryID) query.category = categoryID;

  if (price) {
    const [min, max] = price.split(",");

    query.price = {
      $gt: min,
      $lt: max
    };
  }

  try {
    const products = await Product.find(query)
      .sort(`${sortBy === "desc" ? "-" : ""}${sortable}`)
      .skip(Number(skip))
      .limit(Number(take))
      .exec();

    res.send(products);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving products"
    });
  }
};

exports.read = async (req, res) => {
  const { params } = req;

  try {
    const product = await Product.findById(params.id);

    if (!product) {
      return res.status(404).send({
        message: "Product not found"
      });
    }

    res.send(product);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Product not found"
      });
    }

    return res.status(500).send({
      message: "Error retrieving product"
    });
  }
};

exports.create = async (req, res) => {
  const { body, file } = req;
  const payload = { ...body };

  if (file) {
    payload.photo = file.filename;
  }

  const newProduct = new Product(payload);

  try {
    const product = await newProduct.save();
    res.send(product);
  } catch (error) {
    return res.status(400).send({
      message: "Error occurred while creating product"
    });
  }
};

exports.update = async (req, res) => {
  const { params, body, file } = req;
  const payload = { ...body };

  if (file) {
    payload.photo = file.filename;
  }

  try {
    const product = await Product.findOneAndUpdate(
      { _id: params.id },
      payload,
      {
        new: true
      }
    );

    if (!product) {
      return res.status(404).send({
        message: "Product not found"
      });
    }

    res.send(product);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Product not found"
      });
    }

    return res.status(500).send({
      message: "Error finding product"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const product = await Product.remove({ _id: params.id });

    if (!product) {
      return res.status(404).send({
        message: "Product not found"
      });
    }

    const photoPath = path.resolve("public/images/products");
    const photo = `${photoPath}/${product.photo}`;

    // Delete photo if exist
    if (fs.existsSync(photo)) {
      fs.unlinkSync(photo);
    }

    res.send({ message: "Product deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Product not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete product"
    });
  }
};
