const faker = require("faker");
const Product = require("../models/product");
const Category = require("../models/category");

module.exports = {
  async up() {
    try {
      const categories = await Category.find({});
      const products = [...Array(30)].map(() => ({
        name: faker.commerce.productName(),
        category: categories[Math.floor(Math.random() * categories.length)]._id,
        price: Number(faker.commerce.price(10, 2000)),
        stock: 5,
        photo: "default.png",
        description: faker.lorem.text(320)
      }));

      await Product.create(products);
      console.log("Products successfully seeded");
    } catch (error) {
      console.error(error);
    }
  },
  async down() {
    try {
      await Product.remove({});
      console.log("Products successfully truncated");
    } catch (error) {
      console.error(error);
    }
  }
};
