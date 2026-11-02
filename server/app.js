
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";
import cowRoutes from "./routes/cowRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Cow Management API
app.use("/api/cows", cowRoutes);

// Expense Management API
app.use("/api/expenses", expenseRoutes);

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
