
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    message: "Morya FarmOS backend is running",
  });
});

app.get("/api/db-test", (req, res) => {
  db.query("SELECT 1 AS result", (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Database query failed",
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "MySQL database connected successfully!",
      data: results[0],
    });
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
