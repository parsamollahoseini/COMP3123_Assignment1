/**
 * COMP3123 – Final Fixed Backend Server
 * Works locally AND on Vercel
 */

import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// DB + Routes
import { connectDB } from "./src/db.js";
import userRoutes from "./src/routes/user.routes.js";
import employeeRoutes from "./src/routes/employee.routes.js";

/* -------------------- Paths -------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* -------------------- Environment -------------------- */
dotenv.config();

/* -------------------- Express App ------------------------- */
const app = express();

/* -------------------- CORS CONFIG (SIMPLE & WORKING) -------------------- */
app.use(cors({
    origin: true, // Allow all origins (you can restrict later)
    credentials: true
}));

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* -------------------- Static Files -------------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* -------------------- Routes -------------------- */
app.get("/", (_req, res) => {
    return res.json({
        status: true,
        message: "COMP3123 Assignment 1 API is running successfully 🚀",
    });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

/* -------------------- MongoDB Connection -------------------- */
await connectDB();

/* -------------------- Vercel Export -------------------- */
export default app;

/* -------------------- Local Development Server -------------------- */
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Local backend running at http://localhost:${PORT}`);
    });
}