const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretToken = process.env.secret_token;
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, secretToken); // Use the same secret key
    req.user = verified; // Attach verified user data to the request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authenticateToken;
