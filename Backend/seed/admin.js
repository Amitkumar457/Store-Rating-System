const bcrypt = require("bcryptjs");
const db = require("../src/config/db"); 

async function createAdmin() {
  const password = await bcrypt.hash("Admin@123", 10);

  await db.execute(
    "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
    ["Admin User Name Here", "admin@test.com", password, "Admin Address", "admin"]
  );

  console.log("Admin created");
}

createAdmin();