const express = require("express");
const Router = require("./Routes/Routes.jsx");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const dbConString = process.env.DB_STR;
mongoose
  .connect(dbConString)
  .then(() => console.log("Db Connected..."))
  .catch(() => console.log("Fetching problem in connection..."));
// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api", Router);

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
