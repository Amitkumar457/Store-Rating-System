const db = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const [[users]] = await db.execute("SELECT COUNT(*) as total FROM users");
    const [[stores]] = await db.execute("SELECT COUNT(*) as total FROM stores");
    const [[ratings]] = await db.execute("SELECT COUNT(*) as total FROM ratings");

    res.json({
      totalUsers: users.total,
      totalStores: stores.total,
      totalRatings: ratings.total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };