"use strict";

const path = require("path");
const fs = require("fs");

const User = require("../models/user");

exports.index = async (req, res) => {
  const {
    name = "",
    sortable = "createdAt",
    sortBy = "asc",
    skip = 0,
    take = User.count(),
    role
  } = req.query;
  const query = {
    name: new RegExp(name, "i")
  };

  if (role) query.role = role.toUpperCase();

  try {
    const users = await User.find(query)
      .sort(`${sortBy === "desc" ? "-" : ""}${sortable}`)
      .skip(Number(skip))
      .limit(Number(take))
      .exec();

    res.send(users);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving users"
    });
  }
};

exports.read = async (req, res) => {
  const { params } = req;

  try {
    const user = await User.findById(params.id);

    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }

    res.send(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "User not found"
      });
    }

    return res.status(500).send({
      message: "Error retrieving user"
    });
  }
};

exports.create = async (req, res) => {
  const { body, file } = req;
  const payload = { ...body };

  if (file) {
    payload.photo = file.filename;
  }

  const newUser = new User(payload);

  try {
    const user = await newUser.save();
    res.send(user);
  } catch (error) {
    return res.status(400).send({
      message: "Error occurred while creating user"
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
    const user = await User.findOneAndUpdate({ _id: params.id }, payload, {
      new: true
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }

    res.send(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "User not found"
      });
    }

    return res.status(500).send({
      message: "Error finding user"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const user = await User.remove({ _id: params.id });

    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }

    const photoPath = path.resolve("public/images/users");
    const photo = `${photoPath}/${user.photo}`;

    // Delete photo if exist
    if (fs.existsSync(photo)) {
      fs.unlinkSync(photo);
    }

    res.send({ message: "User deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "User not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete user"
    });
  }
};
