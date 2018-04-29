const faker = require("faker");
const User = require("../models/user");

module.exports = {
  async up() {
    const createUser = (role, index) => {
      const username = `${role.toLowerCase()}${index || ""}`;

      return {
        name:
          role === "SELLER"
            ? faker.company.companyName()
            : faker.name.findName(),
        username,
        email: `${username}@lapakpedia.com`,
        password: username,
        role
      };
    };

    const admin = createUser("ADMIN");
    const member = createUser("MEMBER");
    const sellers = [...Array(3)].map((seller, index) =>
      createUser("SELLER", index)
    );
    const users = [admin, member, ...sellers];

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
