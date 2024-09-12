const pool = require("../db");
const queries = require("../queries");
const bcrypt = require("bcryptjs");
const validation = require("../middleware/validation");

const getAllUsers = async (req, res) => {
  try {
    const results = await pool.query(queries.getAllUsers);
    return res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const results = await pool.query(queries.getUserById, [id]);
    if (results.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const { error } = validation.validateUser(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const emailResults = await pool.query(queries.getUserByEmail, [email]);
    if (emailResults.rows.length > 0) {
      return res.status(400).send({ message: "User with this email already exists" });
    }
    const usernameResults = await pool.query(queries.getUserByUsername, [username]);
    if (usernameResults.rows.length > 0) {
      return res.status(400).send({ message: "User with this username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    pool.query(queries.createUser, [username, email, hashedPassword], (error, results) => {
      return res.status(201).send({ message: "User added successfully" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
};
