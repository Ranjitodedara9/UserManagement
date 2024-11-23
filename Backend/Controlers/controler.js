const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/usermodel");

require("dotenv").config();
const secretToken = process.env.secret_token;
const controller = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("email che");
        return res.status(400).json({ error: "Email is already registered." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      // Save the user to the database
      const savedUser = await newUser.save();

      // Generate a JWT token
      const token = jwt.sign(
        { id: savedUser._id, email: savedUser.email },
        secretToken,
        { expiresIn: "1h" }
      );

      // Send the token and user details as response
      res.status(201).json({
        message: "User registered successfully!",
        token,
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  profile: async (req, res) => {
    try {
      // Get token from the headers
      const token = req.headers.authorization?.split(" ")[1];

      // Check if the token exists
      if (!token) {
        return res
          .status(401)
          .json({ error: "Access denied. No token provided." });
      }

      // Verify the token
      const decoded = jwt.verify(token, secretToken); // Use the same secret as in the `register` method

      // Fetch the user's details from the database
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Return the user's profile
      res.status(200).json({
        message: "User profile retrieved successfully!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Error during profile retrieval:", error);
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token." });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired." });
      }
      res.status(500).json({ error: "Internal server error." });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required." });
      }

      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        secretToken, // Use an environment variable in production
        { expiresIn: "1h" } // Token validity (1 hour in this case)
      );

      // Send the token and user details as response
      res.status(200).json({
        message: "Login successful!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
  updateProfile: async (req, res) => {
    try {
      // Get the new data from the request body
      const { name, email } = req.body;

      // Validate input
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required." });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      user.name = name;
      user.email = email;

      const updatedUser = await user.save();

      res.status(200).json({
        message: "Profile updated successfully!",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          createdAt: updatedUser.createdAt,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
};

module.exports = controller;
