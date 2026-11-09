import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";
import cowRoutes from "./routes/cowRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json());

// Main Application APIs
app.use("/api/cows", cowRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Backend health check
app.get("/api/test", (req, res) => {
  res.json({
    message: "Morya FarmCare backend is running"
  });
});

// Database connection test
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS result");
    res.json({
      success: true,
      message: "MySQL database connected successfully",
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database query failed",
      error: error.message
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
