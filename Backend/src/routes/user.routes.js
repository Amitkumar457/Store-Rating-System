const express = require("express");
const router = express.Router();

const { submitRating } = require("../controllers/rating.controller");
const { getStores } = require("../controllers/store.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { updatePassword } = require("../controllers/user.controller");

router.put("/update-password", authMiddleware, updatePassword);


router.get("/stores", authMiddleware, getStores);

// Only logged-in users
router.post("/rate", authMiddleware, submitRating);

module.exports = router;

