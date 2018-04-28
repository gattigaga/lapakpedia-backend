const passport = require("passport");
const multer = require("multer");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const favouriteController = require("../controllers/favouriteController");
const orderController = require("../controllers/orderController");

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

  // Favourite API

  app
    .route("/favourites")
    .all(passport.authenticate("jwt", { session: false }))
    .get(favouriteController.index)
    .post(favouriteController.create);

  app
    .route("/favourites/:id")
    .delete(
      passport.authenticate("jwt", { session: false }),
      favouriteController.delete
    );

  // Order API

  app
    .route("/orders")
    .all(passport.authenticate("jwt", { session: false }))
    .get(orderController.index)
    .post(orderController.create);

  app
    .route("/orders/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .get(orderController.read)
    .put(orderController.update)
    .delete(orderController.delete);
};

module.exports = routes;
