"use strict";

const Category = require("../models/category");

exports.index = async (req, res) => {
  try {
    const purchases = await Category.find({})
      .sort("name")
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
  const newCategory = new Category(body);

  try {
    const category = await newCategory.save();
    res.send(category);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error occurred while creating category"
    });
  }
};

exports.read = async (req, res) => {
  const { params } = req;

  try {
    const category = await Category.findById(params.id);

    if (!category) {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    res.send(category);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    return res.status(500).send({
      message: "Error retrieving category"
    });
  }
};

exports.update = async (req, res) => {
  const { body, params } = req;

  try {
    const category = await Category.findOneAndUpdate({ _id: params.id }, body, {
      new: true
    });

    if (!category) {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    res.send(category);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    return res.status(500).send({
      message: "Error finding category"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const category = await Category.remove({ _id: params.id });

    if (!category) {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    res.send({ message: "Category deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete category"
    });
  }
};
