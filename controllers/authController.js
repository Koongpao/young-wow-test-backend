const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");
const queries = require("../queries");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }
  try {
    const user = await pool.query(queries.getFullUserByEmail, [email]);
    if (user.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = jwt.sign({ user_id: user.rows[0].id, username: user.rows[0].username }, secretKey);
    res.status(200).send({ message: "Login Successful", data: { token } });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  userLogin,
};
