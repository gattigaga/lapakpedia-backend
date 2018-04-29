const users = require("./users");
const categories = require("./categories");
const products = require("./products");

const seeders = [users, categories, products];

module.exports = {
  up() {
    seeders.forEach(seeder => seeder.up());
  },
  down() {
    seeders.forEach(seeder => seeder.down());
  }
};
