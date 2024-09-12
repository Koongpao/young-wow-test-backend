const pool = require("../db");
const queries = require("../queries");
const validation = require("../middleware/validation");

const getAllPosts = async (req, res) => {
  try {
    const results = await pool.query(queries.getAllPosts);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getPostById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const results = await pool.query(queries.getPostById, [id]);
    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Post not found" });
    }
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.user_id;
  req.body.user_id = userId;
  const { error } = validation.validateCreatePost(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  try {
    const results = await pool.query(queries.createPost, [title, content, userId]);
    return res.status(201).send({ message: "Post added successfully", data: results.rows[0] });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const updatePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  const userId = req.user.user_id;
  req.body.user_id = userId;
  req.body.id = postId;
  const { error } = validation.validateUpdatePost(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  try {
    const post = await pool.query(queries.getPostById, [postId]);
    if (post.rowCount === 0) {
      return res.status(404).send({ message: "Post not found" });
    }
    if (post.rows[0].user_id !== userId) {
      return res.status(401).send({ message: "You are not allowed to update" });
    }
    const updatedPost = await pool.query(queries.updatePost, [
      title || post.rows[0].title,
      content || post.rows[0].content,
      postId,
      userId,
    ]);
    return res.status(200).send({ message: "Post updated successfully", data: updatedPost.rows[0] });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user.user_id;
  try {
    const post = await pool.query(queries.getPostById, [postId]);
    if (post.rowCount === 0) {
      return res.status(404).send({ message: "Post not found" });
    }
    if (post.rows[0].user_id !== userId) {
      return res.status(401).send({ message: "You are not allowed to update" });
    }
    await pool.query(queries.deletePost, [postId]);
    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
