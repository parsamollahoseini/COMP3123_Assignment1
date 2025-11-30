import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { connectDB } from "./src/db.js";
import userRoutes from "./src/routes/user.routes.js";
import employeeRoutes from "./src/routes/employee.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// CORS - Allow both localhost and production frontend
const allowedOrigins = [
    'http://localhost:3000',
    'https://10140911-comp3123-assignment2-reac-vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS not allowed'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => {
    return res.json({
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
        console.log(`🚀 Local backend running at http://localhost:${PORT}`);
    });
}