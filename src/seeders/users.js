const faker = require("faker");
const User = require("../models/user");

module.exports = {
  async up() {
    const createUser = (role, index) => {
      const username = `${role.toLowerCase()}${index || ""}`;

      return {
        name: faker.name.findName(),
        username,
        email: `${username}@lapakpedia.com`,
        password: username,
        role
      };
    };

    const admin = createUser("ADMIN");
    const member = createUser("MEMBER");
    const users = [admin, member];

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
