const Category = require("../models/category");

module.exports = {
  async up() {
    const categories = [
      { name: "Smartphone" },
      { name: "PC & Laptop" },
      { name: "Entertainment" }
    ];

    try {
      await Category.create(categories);
      console.log("Categories successfully seeded");
    } catch (error) {
      console.error(error);
    }
  },
  async down() {
    try {
      await Category.remove({});
      console.log("Categories successfully truncated");
    } catch (error) {
      console.error(error);
    }
  }
};
