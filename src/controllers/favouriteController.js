"use strict";

const Favourite = require("../models/favourite");

exports.index = async (req, res) => {
  const { productID } = req.query;
  const query = {};

  if (productID) {
    query.product = productID;
  }

  try {
    const favourites = await Favourite.find(query);

    res.send(favourites);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving favourites"
    });
  }
};

exports.create = async (req, res) => {
  const { body } = req;
  const newFavourite = new Favourite(body);

  try {
    const favourite = await newFavourite.save();
    res.send(favourite);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error occurred while creating favourite"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const favourite = await Favourite.remove({ _id: params.id });

    if (!favourite) {
      return res.status(404).send({
        message: "Favourite not found"
      });
    }

    res.send({ message: "Favourite deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Favourite not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete favourite"
    });
  }
};
