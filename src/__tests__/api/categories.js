const request = require("supertest");

const User = require("../../models/user");
const Category = require("../../models/category");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

beforeAll(() => {
  return User.create({
    name: "Admin",
    username: "admin",
    email: "admin@lapakpedia.com",
    password: "admin",
    role: "ADMIN"
  });
});

afterAll(() => {
  return User.remove({});
});

describe("GET /categories", () => {
  beforeAll(() => {
    return Category.create(
      { name: "Smartphone" },
      { name: "Console" },
      { name: "Audio" }
    );
  });

  afterAll(() => {
    return Category.remove({});
  });

  it("should get all categories", async () => {
    await request(app)
      .get("/categories")
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });
});

describe("POST /categories", () => {
  afterEach(() => {
    return Category.remove({});
  });

  it("should create new category", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Smartphone"
      })
      .expect(200);
  });
});

describe("GET /categories/:id", () => {
  afterEach(() => {
    return Category.remove({});
  });

  it("should get a category", async () => {
    const response = await login(app);
    const { token } = response.body;

    const category = await Category.create({
      name: "Smartphone"
    });

    await request(app)
      .get(`/categories/${category._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toEqual(category.name);
      });
  });

  it("should failed to get a category", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/categories/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});

describe("PUT /categories/:id", () => {
  afterEach(() => {
    return Category.remove({});
  });

  it("should update a category successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    const category = await Category.create({
      name: "Smartphone"
    });

    await request(app)
      .put(`/categories/${category._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Console"
      })
      .expect(200)
      .expect(res => {
        expect(res.body.name).toEqual("Console");
      });
  });

  it("should failed to update a category", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/categories/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Console"
      })
      .expect(404);
  });
});

describe("DELETE /categories/:id", () => {
  it("should delete a category", async () => {
    const response = await login(app);
    const { token } = response.body;

    const category = await Category.create({
      name: "Smartphone"
    });

    await request(app)
      .delete(`/categories/${category._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should failed to delete a category", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .delete(`/categories/wR0n6`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
