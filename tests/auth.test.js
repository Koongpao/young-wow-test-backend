const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const pool = require("../db");

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash("passwordtest", 10);
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id`,
    ["testauth", "testauth1@example.com", hashedPassword]
  );
  testUserId = result.rows[0].id;
});

afterAll(async () => {
  if (testUserId) {
    await pool.query("DELETE FROM users WHERE id = $1", [testUserId]);
  }
  await pool.end();
});

describe("Auth API routes", () => {
  it("should login a user and respond with token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testauth1@example.com",
      password: "passwordtest",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });
  it("should return a 400 if missing email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "",
      password: "passwordtest",
    });
    expect(response.statusCode).toBe(400);
  });
  it("should return a 400 if missing password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testauth1@example.com",
      password: "",
    });
    expect(response.statusCode).toBe(400);
  });
  it("should return a 404 if user not found", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testauth2@example.com",
      password: "passwordtest",
    });
    expect(response.statusCode).toBe(404);
  });
  it("should return a 401 if password is incorrect", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testauth1@example.com",
      password: "wrongpassword",
    });
    expect(response.statusCode).toBe(401);
  });
});
