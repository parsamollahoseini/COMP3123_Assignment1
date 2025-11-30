import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";  // ADD THIS
import { fileURLToPath } from "url";  // ADD THIS
import { dirname } from "path";  // ADD THIS
import { connectDB } from "./src/db.js";
import userRoutes from "./src/routes/user.routes.js";
import employeeRoutes from "./src/routes/employee.routes.js";

// ADD THESE LINES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // ADD THIS
app.use(morgan("dev"));

// ADD THIS - Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (_req, res) => {
    res.json({
        status: true,
        message: "COMP3123 Assignment 1 API is running successfully 🚀",
    });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

await connectDB();

export default app;

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`✅ Server is running at: http://localhost:${PORT}`);
    });
}