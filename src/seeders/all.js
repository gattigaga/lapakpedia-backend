const users = require("./users");
const categories = require("./categories");

const seeders = [users, categories];

module.exports = {
  up() {
    seeders.forEach(seeder => seeder.up());
  },
  down() {
    seeders.forEach(seeder => seeder.down());
  }
};
