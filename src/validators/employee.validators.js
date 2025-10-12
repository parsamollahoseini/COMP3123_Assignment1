import { body, param, query } from "express-validator";

/**
 * Validation rules for creating a new employee
 */
export const createEmployeeValidator = [
    body("first_name")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("First name is required"),
    body("last_name")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email is required"),
    body("position")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Position is required"),
    body("salary")
        .isNumeric()
        .withMessage("Salary must be a number"),
    body("date_of_joining")
        .isISO8601()
        .toDate()
        .withMessage("Date of joining must be a valid date"),
    body("department")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Department is required"),
];

/**
 * Validation rules for updating an employee by ID
 */
export const updateEmployeeValidator = [
    param("eid").isMongoId().withMessage("Invalid employee ID"),
    body("position")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Position must be a string"),
    body("salary")
        .optional()
        .isNumeric()
        .withMessage("Salary must be numeric"),
    body("first_name").optional().isString().trim(),
    body("last_name").optional().isString().trim(),
    body("email").optional().isEmail().normalizeEmail(),
    body("date_of_joining").optional().isISO8601().toDate(),
    body("department").optional().isString().trim(),
];

/**
 * Validation for getting employee by ID
 */
export const getByIdValidator = [
    param("eid").isMongoId().withMessage("Invalid employee ID"),
];

/**
 * Validation for deleting employee by query param (?eid=xxx)
 */
export const deleteByQueryValidator = [
    query("eid").isMongoId().withMessage("Invalid employee ID"),
];
