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

/* -------------------- Express App -------------------- */
const app = express();

/* -------------------- CORS CONFIG (FINAL + FIXED) -------------------- */

const allowedOrigins = [
    "http://localhost:3000",  // Local React
    "https://comp3123-assignment2-react.vercel.app", // Frontend on Vercel

    // Backend domains
    "https://comp-3123-assignment1.vercel.app",
    "https://comp-3123-assignment1-ouzgp4wua-parsas-projects-218077ab.vercel.app", // REAL backend deployment
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("❌ BLOCKED BY CORS:", origin);
                callback(new Error("CORS Not Allowed"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* ❗ DO NOT USE app.options("*", cors()) — breaks Express 5 */

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

/* -------------------- MongoDB + Vercel Handler -------------------- */
let isConnected = false;

async function ensureDB() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
}

/**
 * Vercel Serverless Export (REQUIRED)
 * This makes Express work on Vercel.
 */
export default async function handler(req, res) {
    await ensureDB();
    return app(req, res);
}

/* -------------------- Local Development Server -------------------- */
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 4000;

    await ensureDB();

    app.listen(PORT, () => {
        console.log(`🚀 Local backend running at http://localhost:${PORT}`);
    });
}
