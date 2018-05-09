const User = require("../models/user");
const Product = require("../models/product");
const Favourite = require("../models/favourite");

module.exports = {
  async up() {
    try {
      const member = await User.findOne({ role: "MEMBER" });
      const products = await Product.find()
        .skip(5)
        .limit(4)
        .exec();

      const createFavourite = product => ({
        member: member._id,
        product: product._id
      });

      const favourites = products.map(createFavourite);

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
