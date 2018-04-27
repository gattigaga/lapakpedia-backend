const passport = require("passport");
const multer = require("multer");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const uploadUserPhoto = multer({ dest: "public/images/users" });

/**
 * Route list
 *
 * @param {object} app - Express instance
 */
const routes = app => {
  // Auth API

  app
    .post("/login", authController.login)
    .get(
      "/me",
      passport.authenticate("jwt", { session: false }),
      authController.me
    );

  // User API

  app
    .route("/users")
    .get(passport.authenticate("jwt", { session: false }), userController.index)
    .post(uploadUserPhoto.single("photo"), userController.create);

  app
    .route("/users/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .get(userController.read)
    .put(uploadUserPhoto.single("photo"), userController.update)
    .delete(userController.delete);
};

module.exports = routes;
