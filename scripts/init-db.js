const pool = require("../db");
const { Pool } = require("pg");

const adminPool = new Pool({
  user: process.env.DB_ADMIN_USER || process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_ADMIN_PASSWORD || process.env.DB_PASSWORD,
});

const databaseName = process.env.DB_DATABASE;

const createDatabase = async () => {
  const adminClient = await adminPool.connect();
  try {
    await adminClient.query(`CREATE DATABASE ${databaseName};`);
    console.log(`Database ${databaseName} created successfully.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`Database ${databaseName} already exists.`);
    } else {
      console.error(`Error creating database ${databaseName}:`, err);
    }
  } finally {
    adminClient.release();
  }
};

const initializeTables = async () => {
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

const main = async () => {
  try {
    await createDatabase();
    await initializeTables();
  } catch (err) {
    console.error("Error in initialization:", err);
  } finally {
    pool.end();
    adminPool.end();
  }
};

main();