import express from "express";
import cors from "cors";
import cowRoutes from "./routes/cowRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cows", cowRoutes);

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});