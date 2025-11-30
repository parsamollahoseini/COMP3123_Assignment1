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

/* -------------------- FIXED CORS -------------------- */
const allowedOrigins = [
    "http://localhost:3000",                                  // local React
    "https://comp3123-assignment2-react.vercel.app",
    "https://comp-3123-assignment1.vercel.app"               // optional if backend also calls itself
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("❌ CORS blocked origin:", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* Allow handling preflight OPTIONS request */
app.options("*", cors());

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* -------------------- Static Uploads -------------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* -------------------- Routes -------------------- */
app.get("/", (_req, res) => {
    res.json({
        status: true,
        message: "COMP3123 Assignment 1 API is running successfully 🚀",
    });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

/* -------------------- DB + Export For Vercel -------------------- */
let isConnected = false;

async function ensureDB() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
}

// Export handler for Vercel
export default async function handler(req, res) {
    await ensureDB();
    return app(req, res);
}

// Local development server
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 4000;
    await ensureDB();
    app.listen(PORT, () => {
        console.log(`🚀 Local server running at http://localhost:${PORT}`);
    });
}
