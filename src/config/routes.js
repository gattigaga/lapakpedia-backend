const passport = require("passport");
const multer = require("multer");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const favouriteController = require("../controllers/favouriteController");
const orderController = require("../controllers/orderController");
const purchaseController = require("../controllers/purchaseController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");

const uploadUserPhoto = multer({ dest: "public/images/users" });
const uploadProductPhoto = multer({ dest: "public/images/products" });

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

  // Purchase API

  app
    .route("/purchases")
    .all(passport.authenticate("jwt", { session: false }))
    .get(purchaseController.index)
    .post(purchaseController.create);

  app
    .route("/purchases/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .get(purchaseController.read)
    .put(purchaseController.update)
    .delete(purchaseController.delete);

  // Product API

  app
    .route("/products")
    .all(passport.authenticate("jwt", { session: false }))
    .get(productController.index)
    .post(uploadProductPhoto.single("photo"), productController.create);

  app
    .route("/products/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .get(productController.read)
    .put(uploadProductPhoto.single("photo"), productController.update)
    .delete(productController.delete);

  // Category API

  app
    .route("/categories")
    .all(passport.authenticate("jwt", { session: false }))
    .get(categoryController.index)
    .post(categoryController.create);

  app
    .route("/categories/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .get(categoryController.read)
    .put(categoryController.update)
    .delete(categoryController.delete);
};

module.exports = routes;
