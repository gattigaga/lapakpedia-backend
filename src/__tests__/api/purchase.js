const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../models/user");
const Purchase = require("../../models/purchase");
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

describe("GET /purchases", () => {
  const orderID = mongoose.Types.ObjectId();
  const productID = mongoose.Types.ObjectId();

  beforeAll(() => {
    return Purchase.create(
      {
        order: orderID,
        product: mongoose.Types.ObjectId(),
        quantity: 1,
        totalPrices: 5000
      },
      {
        order: orderID,
        product: productID,
        quantity: 2,
        totalPrices: 10000
      },
      {
        order: mongoose.Types.ObjectId(),
        product: productID,
        quantity: 3,
        totalPrices: 15000
      }
    );
  });

  afterAll(() => {
    return Purchase.remove({});
  });

  it("should get all purchases", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/purchases")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get purchases by order", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/purchases?orderID=${orderID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get purchases by product", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/purchases?productID=${productID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get purchases by offset", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/purchases?skip=1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get purchases by limit", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/purchases?take=1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(1);
      });
  });

  it("should get sorted purchases in ascending", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/purchases?sortable=totalPrices`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        const total = res.body.length;
        const first = res.body[0];
        const last = res.body[total - 1];

        expect(first.totalPrices).toEqual(5000);
        expect(last.totalPrices).toEqual(15000);
      });
  });

  it("should get sorted purchases in descending", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/purchases?sortable=totalPrices&sortBy=desc`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        const total = res.body.length;
        const first = res.body[0];
        const last = res.body[total - 1];

        expect(last.totalPrices).toEqual(5000);
        expect(first.totalPrices).toEqual(15000);
      });
  });
});

describe("POST /purchases", () => {
  afterEach(() => {
    return Purchase.remove({});
  });

  it("should create new purchase", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .post("/purchases")
      .set("Authorization", `Bearer ${token}`)
      .send({
        order: mongoose.Types.ObjectId(),
        product: mongoose.Types.ObjectId(),
        quantity: 3,
        totalPrices: 1000
      })
      .expect(200);
  });
});

describe("GET /purchases/:id", () => {
  afterEach(() => {
    return Purchase.remove({});
  });

  it("should get a purchase successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    const purchase = await Purchase.create({
      order: mongoose.Types.ObjectId(),
      product: mongoose.Types.ObjectId(),
      quantity: 3,
      totalPrices: 1000
    });

    await request(app)
      .get(`/purchases/${purchase._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.quantity).toEqual(3);
      });
  });

  it("should failed to get a purchase", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/purchases/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});

describe("PUT /purchases/:id", () => {
  afterEach(() => {
    return Purchase.remove({});
  });

  it("should update a purchase successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    const purchase = await Purchase.create({
      order: mongoose.Types.ObjectId(),
      product: mongoose.Types.ObjectId(),
      quantity: 3,
      totalPrices: 1000
    });

    await request(app)
      .put(`/purchases/${purchase._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        rate: 5,
        review: "I like this product"
      })
      .expect(200)
      .expect(res => {
        expect(res.body.rate).toEqual(5);
      });
  });

  it("should failed to update a purchase", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/purchases/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .send({
        rate: 4
      })
      .expect(404);
  });
});

describe("DELETE /purchases/:id", () => {
  it("should delete a purchase", async () => {
    const response = await login(app);
    const { token } = response.body;

    const purchase = await Purchase.create({
      order: mongoose.Types.ObjectId(),
      product: mongoose.Types.ObjectId(),
      quantity: 3,
      totalPrices: 1000
    });

    await request(app)
      .delete(`/purchases/${purchase._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should failed to delete a purchase", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .delete(`/purchases/wR0n6`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});