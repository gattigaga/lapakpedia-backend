const User = require("../models/user");
const Product = require("../models/product");
const Favourite = require("../models/favourite");

module.exports = {
  async up() {
    try {
      const members = await User.find({ role: "MEMBER" });
      const products = await Product.find()
        .skip(5)
        .limit(6)
        .exec();

      let favourites = [];

      // First member likes all products
      products.forEach((product, productIndex) => {
        favourites.push({
          member: members[0]._id,
          product: product._id
        });
      });

      // All member except first member like 3 products
      members.forEach((member, memberIndex) => {
        if (memberIndex === 0) return;

        products.forEach((product, productIndex) => {
          if (productIndex > 3) return;

          favourites.push({
            member: member._id,
            product: product._id
          });
        });
      });

      await Favourite.create(favourites);
      console.log("Favourites successfully seeded");
    } catch (error) {
      console.error(error);
    }
  },
  async down() {
    try {
      await Favourite.remove({});
      console.log("Favourites successfully truncated");
    } catch (error) {
      console.error(error);
    }
  }
};
