const request = require("supertest");
const app = require("../app");
const pool = require("../db");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash("passwordtest", 10);
  const resultUser = await pool.query(
    `INSERT INTO users (username, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id`,
    ["testpost", "testpost1@example.com", hashedPassword]
  );
  testUserId = resultUser.rows[0].id;
  const resultPost = await pool.query(
    `INSERT INTO posts (title, content, user_id)
            VALUES ($1, $2, $3)
            RETURNING id`,
    ["Test Post", "This is a test post", resultUser.rows[0].id]
  );
  testPostId = resultPost.rows[0].id;
  const response = await request(app).post("/auth/login").send({
    email: "testpost1@example.com",
    password: "passwordtest",
  });
  testToken = response.body.data.token;
});

afterAll(async () => {
  if (testUserId) {
    await pool.query("DELETE FROM users WHERE id = $1", [testUserId]);
  }
  if (testPostId) {
    await pool.query("DELETE FROM posts WHERE id = $1", [testPostId]);
  }
  await pool.end();
});

describe("Posts API routes", () => {
  describe("GET /posts", () => {
    it("should get all posts", async () => {
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(200);
      console.log(response.body);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should get a post by id", async () => {
      const response = await request(app).get(`/posts/${testPostId}`);
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return a 404 if post is not found", async () => {
      const response = await request(app).get("/posts/999999");
      expect(response.statusCode).toBe(404);
    });
  });

  describe("POST /posts", () => {
    it("should create a post", async () => {
      const response = await request(app).post("/posts").set("Authorization", testToken).send({
        title: "Test Post 2",
        content: "This is a test post 2",
      });
      expect(response.statusCode).toBe(201);
      const newPost = await request(app).get(`/posts/${response.body.data.id}`);
      expect(newPost.statusCode).toBe(200);
      expect(newPost.body[0].id).toBe(response.body.data.id);
    });

    it("should return a 400 if missing fields", async () => {
      const response = await request(app).post("/posts").set("Authorization", testToken).send({
        title: "",
        content: "This is a test post",
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("PUT /posts/:id", () => {
    it("should update a post", async () => {
      const response = await request(app).put(`/posts/${testPostId}`).set("Authorization", testToken).send({
        title: "Updated Test Post",
        content: "This is an updated test post",
      });

      expect(response.statusCode).toBe(200);
      const updatedPost = await request(app).get(`/posts/${testPostId}`);
      expect(updatedPost.body[0].title).toBe("Updated Test Post");
    });

    it("should still update the post even if missing fields", async () => {
      const response = await request(app).put(`/posts/${testPostId}`).set("Authorization", testToken).send({
        content: "This post title is missing",
      });
      expect(response.statusCode).toBe(200);
      const updatedPost = await request(app).get(`/posts/${testPostId}`);
      expect(updatedPost.body[0].content).toBe("This post title is missing");

      const response2 = await request(app).put(`/posts/${testPostId}`).set("Authorization", testToken).send({
        title: "This post content is missing",
      });
      expect(response2.statusCode).toBe(200);
      const updatedPost2 = await request(app).get(`/posts/${testPostId}`);
      expect(updatedPost2.body[0].title).toBe("This post content is missing");
    });

    it("should return a 404 if post is not found", async () => {
      const response = await request(app).put("/posts/999999").set("Authorization", testToken).send({
        title: "Updated Test Post",
        content: "This is an updated test post",
      });
      expect(response.statusCode).toBe(404);
    });

    it("should return a 401 if user is not the author of the post", async () => {
      const response = await request(app)
        .put(`/posts/${testPostId}`)
        .set("Authorization", "Not the author's token")
        .send({
          title: "Updated Test Post",
          content: "This is an updated test post",
        });
      expect(response.statusCode).toBe(401);
    });
  });

  describe("DELETE /posts/:id", () => {
    it("should delete a post", async () => {
      const test_delete = await pool.query(
        "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING id",
        ["Test Post 3", "This is a test post 3", testUserId]
      );
      const response = await request(app).delete(`/posts/${test_delete.rows[0].id}`).set("Authorization", testToken);
      expect(response.statusCode).toBe(200);
      const deletedPost = await request(app).get(`/posts/${test_delete.rows[0].id}`);
      expect(deletedPost.statusCode).toBe(404);
    });

    it("should return a 404 if post is not found", async () => {
      const response = await request(app).delete("/posts/999999").set("Authorization", testToken);
      expect(response.statusCode).toBe(404);
    });

    it("should return a 401 if user is not the author of the post", async () => {
      const response = await request(app).delete(`/posts/${testPostId}`).set("Authorization", "Not the author's token");
      expect(response.statusCode).toBe(401);
    });
  });
});
