const db = require("../config/db");

// Submit or Update Rating
const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { store_id, rating } = req.body;

    // Validate rating
    if (!store_id || !rating) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1 to 5" });
    }

    // Check if already rated
    const [existing] = await db.execute(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, store_id]
    );

    if (existing.length > 0) {
      // Update rating
      await db.execute(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, userId, store_id]
      );

      return res.json({ message: "Rating updated" });
    }

    // Insert new rating
    await db.execute(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, store_id, rating]
    );

    res.status(201).json({ message: "Rating submitted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitRating };