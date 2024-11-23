const express = require("express"); // Import express
const Router = express.Router();
const User = require("../Model/usermodel.js"); // Use Router
const controler = require("../Controlers/controler.js"); // Import the controller
const authenticateToken = require("../middleware/middleware.js");
// Define the POST route for registration
Router.post("/users/register", controler.register);
Router.get("/users/profile", controler.profile);
Router.post("/users/login", controler.login);
Router.put("/users/profile", authenticateToken, controler.updateProfile);

module.exports = Router;
