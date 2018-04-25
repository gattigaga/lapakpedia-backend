const request = require("supertest");

/**
 * Test login and need to return it's response
 *
 * @param {object} app - Express instance
 * @returns {object}
 */
const login = app => {
  return request(app)
    .post("/login")
    .send({
      username: "admin",
      password: "admin"
    });
};

module.exports = { login };
