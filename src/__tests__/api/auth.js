const request = require("supertest");
const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

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

describe("POST /login", () => {
  it("should login with username", async () => {
    await request(app)
      .post("/login")
      .send({
        username: "admin",
        password: "admin"
      })
      .expect(200);
  });

  it("should login with email", async () => {
    await request(app)
      .post("/login")
      .send({
        email: "admin@lapakpedia.com",
        password: "admin"
      })
      .expect(200);
  });

  it("should failed to login caused by password did not match", async () => {
    await request(app)
      .post("/login")
      .send({
        username: "admin",
        password: "wrong"
      })
      .expect(401);
  });

  it("should failed to login caused by user doesn't exist", async () => {
    await request(app)
      .post("/login")
      .send({
        username: "noexist",
        password: "noexist"
      })
      .expect(404);
  });

  it("should failed to login caused by empty form", async () => {
    await request(app)
      .post("/login")
      .expect(404);
  });
});

describe("GET /me", () => {
  it("should get authenticated user successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should get authenticated user failed", async () => {
    await request(app)
      .get("/me")
      .set("Authorization", `Bearer wR0n6`)
      .expect(401);
  });
});
