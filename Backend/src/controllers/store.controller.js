const db = require("../config/db");

// Create Store
const createStore = async (req, res) => {
  try {
    const { name, address, owner_id } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (address.length > 400) {
      return res.status(400).json({ message: "Address cannot exceed 400 characters" });
    }

    await db.execute(
      "INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)",
      [name, address, owner_id || null]
    );

    res.status(201).json({ message: "Store created successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// GET all stores with avg rating + user rating + search
const getStores = async (req, res) => {
  try {
    const userId = req.user.id;
    const search = req.query.search || "";

    const [stores] = await db.execute(
      `
      SELECT 
        s.id,
        s.name,
        s.address,
        AVG(r.rating) AS average_rating,
        MAX(ur.rating) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
      WHERE s.name LIKE ? OR s.address LIKE ?
      GROUP BY s.id, s.name, s.address
      `,
      [userId, `%${search}%`, `%${search}%`]
    );

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStores = async (req, res) => {
  try {
    const search = req.query.search || "";

    const [stores] = await db.execute(
      `
      SELECT 
        s.id,
        s.name,
        s.address,
        u.email,
        AVG(r.rating) AS average_rating
      FROM stores s
      LEFT JOIN users u ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.name LIKE ? OR s.address LIKE ? OR u.email LIKE ?
      GROUP BY s.id, s.name, s.address, u.email
      `,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStores, getAllStores, createStore  };
