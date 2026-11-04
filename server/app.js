
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";
import cowRoutes from "./routes/cowRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import breedingRoutes from "./routes/breedingRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
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

// Cow Management API
app.use("/api/cows", cowRoutes);

// Expense Management API
app.use("/api/expenses", expenseRoutes);

// Breeding Management API
app.use("/api/breeding", breedingRoutes);

// Authentication register user
app.use("/api/auth", authRoutes);

// Backend test
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
            message: "Database query failed"
        });
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
