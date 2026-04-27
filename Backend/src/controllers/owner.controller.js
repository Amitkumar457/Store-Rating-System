const db = require("../config/db");

const getOwnerRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [[summary]] = await db.execute(
      `
      SELECT AVG(r.rating) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = ?
      `,
      [ownerId]
    );

    const [ratings] = await db.execute(
      `
      SELECT 
        s.id AS store_id,
        s.name AS store_name,
        u.name AS user_name,
        u.email,
        u.address,
        r.rating
      FROM stores s
      JOIN ratings r ON s.id = r.store_id
      JOIN users u ON u.id = r.user_id
      WHERE s.owner_id = ?
      ORDER BY s.name, u.name
      `,
      [ownerId]
    );

    res.json({
      averageRating: summary.average_rating,
      ratings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOwnerRatings };
