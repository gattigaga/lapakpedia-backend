const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../models/user");
const Favourite = require("../../models/favourite");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

const createFavourite = product => ({
  member: mongoose.Types.ObjectId(),
  product: product || mongoose.Types.ObjectId()
});

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

describe("GET /favourites", () => {
  beforeAll(() => {
    return Favourite.create(
      createFavourite(),
      createFavourite(),
      createFavourite()
    );
  });

  afterAll(() => {
    return Favourite.remove({});
  });

  it("should get all favourites", async () => {
    await request(app)
      .get("/favourites")
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get favourites by product ID", async () => {
    const product = mongoose.Types.ObjectId();

    await Favourite.create(createFavourite(product), createFavourite(product));

    await request(app)
      .get(`/favourites?productID=${product}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });
});

describe("POST /favourites", () => {
  afterEach(() => {
    return Favourite.remove({});
  });

  it("should create new favourite", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .post("/favourites")
      .set("Authorization", `Bearer ${token}`)
      .send(createFavourite())
      .expect(200);
  });
});

describe("DELETE /favourites/:id", () => {
  it("should delete a favourite", async () => {
    const response = await login(app);
    const { token } = response.body;

    const favourite = await Favourite.create(createFavourite());

    await request(app)
      .delete(`/favourites/${favourite.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should failed to delete a favourite", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .delete(`/favourites/wR0n6`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
