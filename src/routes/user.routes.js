import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { signupValidator, loginValidator } from "../validators/user.validators.js";

const router = express.Router();

/**
 * @route   POST /api/v1/user/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", signupValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ status: false, message: "Validation error", errors: errors.array() });
    }

    try {
        const { username, email, password } = req.body;

        // check if user exists
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(409).json({ status: false, message: "User already exists" });
        }

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashed,
        });

        return res.status(201).json({
            message: "User created successfully.",
            user_id: newUser._id.toString(),
        });
    } catch (err) {
        console.error("Signup error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

/**
 * @route   POST /api/v1/user/login
 * @desc    Login using email or username + password
 * @access  Public
 */
router.post("/login", loginValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ status: false, message: "Validation error", errors: errors.array() });
    }

    try {
        const { email, username, password } = req.body;

        // find by email or username
        const user = await User.findOne(email ? { email } : { username });
        if (!user) {
            return res.status(401).json({ status: false, message: "Invalid Username and password" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid Username and password" });
        }

        // generate JWT token (optional)
        let token = "Optional implementation";
        if (process.env.JWT_SECRET) {
            token = jwt.sign(
                {
                    uid: user._id.toString(),
                    username: user.username,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
            );
        }

        return res.status(200).json({
            message: "Login successful.",
            jwt_token: token,
        });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

export default router;
