const faker = require("faker");
const User = require("../models/user");

module.exports = {
  async up() {
    const users = [...Array(5)].map((user, index) => {
      const isFirst = index === 0;
      const name = isFirst ? "Admin" : faker.name.findName();
      const username = isFirst ? "admin" : `member${index}`;
      const role = isFirst ? "ADMIN" : "MEMBER";

      return {
        name,
        username,
        email: `${username}@lapakpedia.com`,
        password: username,
        role
      };
    });

    try {
      await User.create(users);
      console.log("Users successfully seeded");
    } catch (error) {
      console.error(error);
    }
  },
  async down() {
    try {
      await User.remove({});
      console.log("Users successfully truncated");
    } catch (error) {
      console.error(error);
    }
  }
};
