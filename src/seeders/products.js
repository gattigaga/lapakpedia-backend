const faker = require("faker");
const Product = require("../models/product");
const Category = require("../models/category");
const User = require("../models/user");

module.exports = {
  async up() {
    try {
      const [sellers, categories] = await Promise.all([
        User.find({ role: "SELLER" }),
        Category.find({})
      ]);
      const totalProducts = sellers.length * 10;

      const products = [...Array(totalProducts)].map(() => ({
        name: faker.commerce.productName(),
        seller: sellers[Math.floor(Math.random() * sellers.length)]._id,
        category: categories[Math.floor(Math.random() * categories.length)]._id,
        price: Number(faker.commerce.price(10, 99)),
        stock: 5,
        photo: "blank-photo.png",
        description: faker.lorem.text()
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
