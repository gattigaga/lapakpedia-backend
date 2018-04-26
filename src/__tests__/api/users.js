const request = require("supertest");
const path = require("path");
const fs = require("fs");

const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

const photoPath = path.resolve("public/images/users");

const createUser = (name, role) => {
  const username = name.toLowerCase();

  return {
    name,
    username,
    email: `${username}@lapakpedia.com`,
    password: username,
    role
  };
};

beforeAll(() => {
  return User.create(
    createUser("Admin", "ADMIN"),
    createUser("Member1", "MEMBER"),
    createUser("Member2", "MEMBER"),
    createUser("Member3", "MEMBER")
  );
});

afterAll(() => {
  return User.remove({});
});

describe("GET /users", () => {
  it("should get all users successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(4);
      });
  });

  it("should get users by name successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?name=member")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get blank users caused by name not exist", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?name=nonmember")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(0);
      });
  });

  it("should get users by role successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?role=admin")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(1);
      });
  });

  it("should get blank users caused by role not exist", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?role=nonmember")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(0);
      });
  });

  it("should get users by offset successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?skip=1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get blank users caused by too much offset", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?skip=10")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(0);
      });
  });

  it("should not get users (error) caused by too low offset", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?skip=-10")
      .set("Authorization", `Bearer ${token}`)
      .expect(500);
  });

  it("should get users by limit successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?take=2")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get sortable users in ascending by name successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?sortable=name&sortBy=asc")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body[0].name).toEqual("Admin");
        expect(res.body[3].name).toEqual("Member3");
      });
  });

  it("should get sortable users in descending by name successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?sortable=name&sortBy=desc")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body[3].name).toEqual("Admin");
        expect(res.body[0].name).toEqual("Member3");
      });
  });

  it("should get sortable users in ascending caused by invalid sort order", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users?sortBy=unknown&sortable=name")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body[0].name).toEqual("Admin");
        expect(res.body[3].name).toEqual("Member3");
      });
  });
});

describe("POST /users", () => {
  it("should create new user successfully", async () => {
    await request(app)
      .post("/users")
      .send(createUser("Member4", "MEMBER"))
      .expect(200);
  });

  it("should create new user with photo successfully", async () => {
    await request(app)
      .post("/users")
      .field("name", "Member6")
      .field("username", "member6")
      .field("email", "member6@lapakpedia.com")
      .field("password", "member6")
      .field("role", "MEMBER")
      .attach("photo", "fixtures/dummy.png")
      .expect(200)
      .expect(res => {
        const photo = `${photoPath}/${res.body.photo}`;
        expect(fs.existsSync(photo)).toEqual(true);
      });
  });

  it("should failed to create new user caused by some required field empty", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "Member5",
        username: "member5"
      })
      .expect(400);
  });

  it("should create new user failed caused by invalid role", async () => {
    await request(app)
      .post("/users")
      .send(createUser("Member10", "NONMEMBER"))
      .expect(400);
  });
});

describe("GET /users/:userID", () => {
  it("should get an user successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    const user = await User.findOne({ username: "member3" });

    await request(app)
      .get(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toEqual("Member3");
      });
  });

  it("should failed to get an user", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});

describe("PUT /users/:userID", () => {
  it("should update an user successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    const user = await User.findOne({ username: "member3" });

    await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Member"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          name: "Updated Member",
          username: "member3"
        });
      });
  });

  it("should update an user with photo successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    const user = await User.findOne({ username: "member3" });

    await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("photo", "fixtures/dummy.png")
      .expect(200)
      .expect(res => {
        const oldPhoto = `${photoPath}/${user.photo}`;
        const newPhoto = `${photoPath}/${res.body.photo}`;

        expect(fs.existsSync(oldPhoto)).toEqual(false);
        expect(fs.existsSync(newPhoto)).toEqual(true);
      });
  });

  it("should failed to update an user", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Member"
      })
      .expect(404);
  });
});

describe("DELETE /users/:userID", () => {
  it("should delete an user successfully", async () => {
    const response = await login(app);
    const { token } = response.body;

    let user = await User.findOne({ username: "member3" });

    await request(app)
      .delete(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        const photo = `${photoPath}/${res.body.photo}`;
        expect(fs.existsSync(photo)).toEqual(false);
      });
  });

  it("should failed to delete an user", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .delete("/users/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
