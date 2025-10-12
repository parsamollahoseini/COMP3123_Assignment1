import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/db.js";
import userRoutes from "./src/routes/user.routes.js";
import employeeRoutes from "./src/routes/employee.routes.js";

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Default route for testing
app.get("/", (req, res) => {
    res.json({
        status: true,
        message: "COMP3123 Assignment 1 API is running successfully 🚀",
    });
});

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

// Port setup
const PORT = process.env.PORT || 4000;

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is running at: http://localhost:${PORT}`);
    });
});
