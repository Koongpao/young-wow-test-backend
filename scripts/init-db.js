const pool = require("../db");

const initializeDatabase = async () => {
  let client;

  try {
    client = await pool.connect();

    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("Tables initialized successfully.");
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Error initializing tables:", error);
  } finally {
    if (client) client.release();
  }
};

initializeDatabase().catch((err) => console.error("Error in initialization:", err).finally(() => pool.end()));
