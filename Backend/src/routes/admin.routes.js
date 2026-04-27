const express = require("express");
const router = express.Router();

const { createStore } = require("../controllers/store.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const { getDashboard } = require("../controllers/admin.controller");

const { getAllUsers, createUser } = require("../controllers/user.controller");
const { getAllStores } = require("../controllers/store.controller");

router.get(
  "/stores",
  authMiddleware,
  roleMiddleware("admin"),
  getAllStores
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

router.post(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  createUser
);

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  getDashboard
);

// Only admin can create store
router.post(
  "/create-store",
  authMiddleware,
  roleMiddleware("admin"),
  createStore
);

module.exports = router;
