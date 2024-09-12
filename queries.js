const getAllUsers = "SELECT id, username, email FROM users";
const getUserById = "SELECT id, username, email FROM users WHERE id = $1";
const getUserByEmail = "SELECT id, username, email FROM users WHERE email = $1";
const getUserByUsername = "SELECT id, username, email FROM users WHERE username = $1";
const createUser = "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)";

const getFullUserByEmail = "SELECT * FROM users WHERE email = $1";

const getAllPosts = `
  SELECT posts.*, users.username 
  FROM posts 
  JOIN users ON posts.user_id = users.id
  ORDER BY posts.created_at DESC
`;
const getPostById = `
  SELECT posts.*, users.username 
  FROM posts 
  JOIN users ON posts.user_id = users.id
  WHERE posts.id = $1
`;
const getPostsByUserId = "SELECT * FROM posts WHERE user_id = $1";
const createPost = "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *";
const updatePost = "UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *";
const deletePost = "DELETE FROM posts WHERE id = $1";

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  createUser,
  getFullUserByEmail,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
};
