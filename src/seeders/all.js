const usersSeeder = require("./users");

const seeders = [usersSeeder];

module.exports = {
  up() {
    seeders.forEach(seeder => seeder.up());
  },
  down() {
    seeders.forEach(seeder => seeder.down());
  }
};
