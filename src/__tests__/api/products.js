const request = require("supertest");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const User = require("../../models/user");
const Product = require("../../models/product");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

const photoPath = path.resolve("public/images/products");

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

describe("GET /products", () => {
  const categoryID = mongoose.Types.ObjectId();

  beforeAll(() => {
    return Product.create(
      {
        name: "IPhone X",
        category: mongoose.Types.ObjectId(),
        price: 25000,
        stock: 1,
        photo: "image.png",
        description: "New generation Phone"
      },
      {
        name: "PlayStation 4",
        category: categoryID,
        price: 30000,
        stock: 2,
        photo: "image.png",
        description: "New generation Video Game"
      },
      {
        name: "Nintendo Switch",
        category: categoryID,
        price: 35000,
        stock: 3,
        photo: "image.png",
        description: "New generation Video Game"
      }
    );
  });

  afterAll(() => {
    return Product.remove({});
  });

  it("should get all products", async () => {
    await request(app)
      .get("/products")
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get products by name", async () => {
    await request(app)
      .get("/products?name=IPhone")
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(1);
      });
  });

  it("should get products by category", async () => {
    await request(app)
      .get(`/products?categoryID=${categoryID}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get products by offset", async () => {
    await request(app)
      .get("/products?skip=1")
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get products by limit", async () => {

    await request(app)
      .get("/products?take=2")
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get sorted products in ascending", async () => {
    await request(app)
      .get("/products?sortable=name")
      .expect(200)
      .expect(res => {
        const total = res.body.length;
        const first = res.body[0];
        const last = res.body[total - 1];

        expect(first.name).toContain("IPhone");
        expect(last.name).toContain("PlayStation");
      });
  });

  it("should get sorted products in descending", async () => {
    await request(app)
      .get("/products?sortable=name&sortBy=desc")
      .expect(200)
      .expect(res => {
        const total = res.body.length;
        const first = res.body[0];
        const last = res.body[total - 1];

        expect(last.name).toContain("IPhone");
        expect(first.name).toContain("PlayStation");
      });
  });

  it("should get products inside price range", async () => {
    await request(app)
      .get("/products?price=28000,36000")
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });
});

describe("POST /products", () => {
  afterEach(() => {
    return Product.remove({});
  });

  it("should create new product", async () => {
    const response = await login(app);
    const { token } = response.body;
    const categoryID = String(mongoose.Types.ObjectId());

    await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "PlayStation 4")
      .field("category", categoryID)
      .field("price", 30000)
      .field("stock", 2)
      .field("description", "Next generation video game")
      .attach("photo", "fixtures/dummy.png")
      .expect(200)
      .expect(res => {
        const photo = `${photoPath}/${res.body.photo}`;
        expect(fs.existsSync(photo)).toEqual(true);
      });
  });
});

describe("GET /products/:id", () => {
  afterEach(() => {
    return Product.remove({});
  });

  it("should get a product successfully", async () => {
    const product = await Product.create({
      name: "IPhone X",
      category: mongoose.Types.ObjectId(),
      price: 25000,
      stock: 5,
      photo: "iphone.png",
      description: "New generation IPhone"
    });

    await request(app)
      .get(`/products/${product._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toEqual(product.name);
      });
  });

  it("should failed to get a product", async () => {
    await request(app)
      .get("/products/wR0n6")
      .expect(404);
  });
});

describe("PUT /products/:id", () => {
  let product;

  beforeAll(async () => {
    product = await Product.create({
      name: "IPhone X",
      category: mongoose.Types.ObjectId(),
      price: 25000,
      stock: 5,
      photo: "iphone.png",
      description: "New generation IPhone"
    });
  });

  afterAll(() => {
    return Product.remove({});
  });

  it("should update a product", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .put(`/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Samsung Galaxy S9+"
      })
      .expect(200)
      .expect(res => {
        expect(res.body.name).toEqual("Samsung Galaxy S9+");
      });
  });

  it("should update a product photo", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .put(`/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("photo", "fixtures/dummy.png")
      .expect(200)
      .expect(res => {
        const oldPhoto = `${photoPath}/${product.photo}`;
        const newPhoto = `${photoPath}/${res.body.photo}`;

        expect(fs.existsSync(oldPhoto)).toEqual(false);
        expect(fs.existsSync(newPhoto)).toEqual(true);
      });
  });

  it("should failed to update a product", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .put("/products/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "IPhone 8"
      })
      .expect(404);
  });
});

describe("DELETE /products/:id", () => {
  it("should delete a product", async () => {
    const response = await login(app);
    const { token } = response.body;

    const product = await Product.create({
      name: "IPhone X",
      category: mongoose.Types.ObjectId(),
      price: 25000,
      stock: 5,
      photo: "iphone.png",
      description: "New generation IPhone"
    });

    await request(app)
      .delete(`/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        const photo = `${photoPath}/${res.body.photo}`;
        expect(fs.existsSync(photo)).toEqual(false);
      });
  });

  it("should failed to delete a product", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .delete("/products/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
