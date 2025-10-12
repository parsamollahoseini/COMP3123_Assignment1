import { body } from "express-validator";

/**
 * Validation rules for user signup
 */
export const signupValidator = [
    body("username")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Username is required"),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email is required"),
    body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

/**
 * Validation rules for user login
 * (Can use either username or email + password)
 */
export const loginValidator = [
    body("password")
        .isString()
        .notEmpty()
        .withMessage("Password is required"),
    body().custom((value) => {
        if (!value.email && !value.username) {
            throw new Error("Either email or username is required");
        }
        return true;
    }),
];
