const users = require("./users");
const categories = require("./categories");
const products = require("./products");
const favourites = require("./favourites");

const seeders = [users, categories, products, favourites];

module.exports = {
  async up() {
    for (const seeder of seeders) {
      await seeder.up();
    }
  },
  async down() {
    for (const seeder of seeders) {
      await seeder.down();
    }
  }
};
