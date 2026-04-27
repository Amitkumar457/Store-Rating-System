const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { validatePassword, validateUserPayload } = require("../utils/validators");

const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const role = req.query.role || "";

    const [users] = await db.execute(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        CASE
          WHEN u.role = 'store_owner' THEN AVG(r.rating)
          ELSE NULL
        END AS owner_rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE
        (u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ? OR u.role LIKE ?)
        AND (? = '' OR u.role = ?)
      GROUP BY u.id, u.name, u.email, u.address, u.role
      `,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, role, role]
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role = "user" } = req.body;
    const allowedRoles = ["user", "admin", "store_owner"];

    const validationError = validateUserPayload({ name, email, password, address });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, address, role]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    const validationError = validatePassword(newPassword);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, userId]
    );

    res.json({ message: "Password updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, createUser, updatePassword };
