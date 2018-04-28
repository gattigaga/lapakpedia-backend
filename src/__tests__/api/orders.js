const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../models/user");
const Order = require("../../models/order");
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

describe("GET /orders", () => {
  // ID of member named Nick Fury
  const memberID = mongoose.Types.ObjectId();

  beforeAll(() => {
    return Order.create(
      {
        member: memberID,
        bankName: "BCA",
        bankAccount: "1234567890",
        bankPerson: "Nick Fury",
        address: "Jl. Yang Lurus",
        zip: "123456",
        phone: "082331552722",
        status: "WAITING"
      },
      {
        member: memberID,
        bankName: "BCA",
        bankAccount: "1234567890",
        bankPerson: "Nick Fury",
        address: "Jl. Yang Lurus",
        zip: "123456",
        phone: "082331552722",
        status: "WAITING"
      },
      {
        member: mongoose.Types.ObjectId(),
        bankName: "American Express",
        bankAccount: "1234567890",
        bankPerson: "Tony Stark",
        address: "Jl. Ke Kanan",
        zip: "123456",
        phone: "082331552722",
        status: "WAITING"
      }
    );
  });

  afterAll(() => {
    return Order.remove({});
  });

  it("should get all orders", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get orders by member", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/orders?memberID=${memberID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get orders by offset", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/orders?skip=1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get orders by limit", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/orders?take=1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(1);
      });
  });

  it("should get sorted orders in ascending", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/orders?sortable=bankName`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        const total = res.body.length;
        const first = res.body[0];
        const last = res.body[total - 1];

        expect(first.bankName).toEqual("American Express");
        expect(last.bankName).toEqual("BCA");
      });
  });

  it("should get sorted orders in descending", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get(`/orders?sortable=bankName&sortBy=desc`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        const total = res.body.length;
        const first = res.body[0];
        const last = res.body[total - 1];

        expect(last.bankName).toEqual("American Express");
        expect(first.bankName).toEqual("BCA");
      });
  });
});

describe("POST /orders", () => {
  afterEach(() => {
    return Order.remove({});
  });

  it("should create new order", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        member: mongoose.Types.ObjectId(),
        bankName: "BCA",
        bankAccount: "1234567890",
        bankPerson: "Nick Fury",
        address: "Jl. Yang Lurus",
        zip: "123456",
        phone: "082331552722",
        status: "WAITING"
      })
      .expect(200);
  });
});

describe("GET /orders/:id", () => {
  afterEach(() => {
    return Order.remove({});
  });

  it("should get an orders successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    const order = await Order.create({
      member: mongoose.Types.ObjectId(),
      bankName: "BCA",
      bankAccount: "1234567890",
      bankPerson: "Nick Fury",
      address: "Jl. Yang Lurus",
      zip: "123456",
      phone: "082331552722",
      status: "WAITING"
    });

    await request(app)
      .get(`/orders/${order._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.bankPerson).toEqual("Nick Fury");
      });
  });

  it("should failed to get an order", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/orders/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});

describe("PUT /orders/:id", () => {
  afterEach(() => {
    return Order.remove({});
  });

  it("should update an order successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    const order = await Order.create({
      member: mongoose.Types.ObjectId(),
      bankName: "BCA",
      bankAccount: "1234567890",
      bankPerson: "Nick Fury",
      address: "Jl. Yang Lurus",
      zip: "123456",
      phone: "082331552722",
      status: "WAITING"
    });

    await request(app)
      .put(`/orders/${order._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "PROCESSED"
      })
      .expect(200)
      .expect(res => {
        expect(res.body.status).toEqual("PROCESSED");
      });
  });

  it("should failed to update an order", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/orders/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "PROCESSED"
      })
      .expect(404);
  });
});

describe("DELETE /orders/:id", () => {
  it("should delete an order", async () => {
    const response = await login(app);
    const { token } = response.body;

    const order = await Order.create({
      member: mongoose.Types.ObjectId(),
      bankName: "BCA",
      bankAccount: "1234567890",
      bankPerson: "Nick Fury",
      address: "Jl. Yang Lurus",
      zip: "123456",
      phone: "082331552722",
      status: "WAITING"
    });

    await request(app)
      .delete(`/orders/${order._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should failed to delete an order", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .delete(`/favourites/wR0n6`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
