const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const { getOwnerRatings } = require("../controllers/owner.controller");
const { updatePassword } = require("../controllers/user.controller");

router.get(
  "/ratings",
  authMiddleware,
  roleMiddleware("store_owner"),
  getOwnerRatings
);

router.put(
  "/update-password",
  authMiddleware,
  roleMiddleware("store_owner"),
  updatePassword
);

// Only store owner
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("store_owner"),
  (req, res) => {
    res.json({ message: "Store Owner Dashboard" });
  }
);

module.exports = router;
