const request = require("supertest");
const app = require("../app");
const pool = require("../db");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash("passwordtest", 10);
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
    ["testverifytoken", "testverifytoken1@example.com", hashedPassword]
  );
  testUserId = result.rows[0].id;
});

afterAll(async () => {
  if (testUserId) {
    await pool.query("DELETE FROM users WHERE id = $1", [testUserId]);
  }
  await pool.end();
});

describe("Verify Token middleware", () => {
  it("should return a 401 if no token is provided ", async () => {
    const response = await request(app).post("/posts");
    expect(response.statusCode).toBe(401);
  });
  it("should return a 401 if token is invalid ", async () => {
    const response = await request(app).post("/posts").set("Authorization", "Bearer invalidtoken");
    expect(response.statusCode).toBe(401);
  });
});
