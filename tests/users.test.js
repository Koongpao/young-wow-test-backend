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
    ["testuser", "testuser1@example.com", hashedPassword]
  );
  testUserId = result.rows[0].id;
});

afterAll(async () => {
  if (testUserId) {
    await pool.query("DELETE FROM users WHERE id = $1", [testUserId]);
  }
  await pool.end();
});

describe("User API routes", () => {
  describe("GET /users", () => {
    it("should get all users", async () => {
      const response = await request(app).get("/users");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should get a user by id", async () => {
      const response = await request(app).get(`/users/${testUserId}`);
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return a 404 if user is not found", async () => {
      const response = await request(app).get("/users/999999");
      expect(response.statusCode).toBe(404);
    });
  });
  describe("POST /users", () => {
    it("should register a user", async () => {
      const response = await request(app).post("/users").send({
        username: "testuser2",
        email: "test2@example.com",
        password: "password",
      });
      expect(response.statusCode).toBe(201);
      await pool.query("DELETE FROM users WHERE username = $1", ["testuser2"]);
    });

    it("should return a 400 if missing fields", async () => {
      const response = await request(app).post("/users").send({
        username: "testuser3",
        email: "",
        password: "password",
      });
      expect(response.statusCode).toBe(400);
    });

    it("should return a 400 if invalid email format", async () => {
      const response = await request(app).post("/users").send({
        username: "testuser4",
        email: "test4example.com",
        password: "password",
      });
      expect(response.statusCode).toBe(400);
    });

    it("should return a 400 if user with email already exists", async () => {
      const response = await request(app).post("/users").send({
        username: "newuser",
        email: "testuser1@example.com",
        password: "password",
      });
      expect(response.statusCode).toBe(400);
    });

    it("should return a 400 if user with username already exists", async () => {
      const response = await request(app).post("/users").send({
        username: "testuser",
        email: "new@gmail.com",
        password: "password",
      });
      expect(response.statusCode).toBe(400);
    });
  });
});
