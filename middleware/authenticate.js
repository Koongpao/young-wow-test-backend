const jwt = require('jsonwebtoken');

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (token == undefined) {
        return res.status(401).send({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Unauthorized" });
    }
}

module.exports = verifyToken;