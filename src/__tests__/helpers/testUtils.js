const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

describe("login()", () => {
  beforeAll(() => {
    return User.create({
      name: "Administrator",
      username: "admin",
      email: "admin@lapakpedia.com",
      password: "admin",
      role: "ADMIN"
    });
  });

  afterAll(() => {
    return User.remove({});
  });

  it("should login successfully", async () => {
    await login(app).expect(200);
  });
});
