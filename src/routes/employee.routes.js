import express from "express";
import { validationResult } from "express-validator";
import Employee from "../models/Employee.js";
import {
    createEmployeeValidator,
    updateEmployeeValidator,
    getByIdValidator,
    deleteByQueryValidator,
} from "../validators/employee.validators.js";
import { authOptional } from "../middleware/auth.js";

const router = express.Router();

// Attach optional JWT middleware
router.use(authOptional);

/**
 * @route   GET /api/v1/emp/employees
 * @desc    Get all employees
 * @access  Public (or Protected if you later enable JWT)
 */
router.get("/employees", async (_req, res) => {
    try {
        const employees = await Employee.find({}, { __v: 0 }).lean();
        const formatted = employees.map((emp) => ({
            employee_id: emp._id.toString(),
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            position: emp.position,
            salary: emp.salary,
            date_of_joining: emp.date_of_joining,
            department: emp.department,
        }));
        return res.status(200).json(formatted);
    } catch (err) {
        console.error("Get all employees error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

/**
 * @route   POST /api/v1/emp/employees
 * @desc    Create a new employee
 * @access  Public (or Protected)
 */
router.post("/employees", createEmployeeValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ status: false, message: "Validation error", errors: errors.array() });
    }

    try {
        const emp = await Employee.create(req.body);
        return res.status(201).json({
            message: "Employee created successfully.",
            employee_id: emp._id.toString(),
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ status: false, message: "Employee email already exists" });
        }
        console.error("Create employee error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

/**
 * @route   GET /api/v1/emp/employees/:eid
 * @desc    Get a single employee by ID
 * @access  Public (or Protected)
 */
router.get("/employees/:eid", getByIdValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ status: false, message: "Validation error", errors: errors.array() });
    }

    try {
        const emp = await Employee.findById(req.params.eid).lean();
        if (!emp) return res.status(404).json({ status: false, message: "Employee not found" });

        return res.status(200).json({
            employee_id: emp._id.toString(),
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            position: emp.position,
            salary: emp.salary,
            date_of_joining: emp.date_of_joining,
            department: emp.department,
        });
    } catch (err) {
        console.error("Get employee by ID error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

/**
 * @route   PUT /api/v1/emp/employees/:eid
 * @desc    Update employee details by ID
 * @access  Public (or Protected)
 */
router.put("/employees/:eid", updateEmployeeValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ status: false, message: "Validation error", errors: errors.array() });
    }

    try {
        const updated = await Employee.findByIdAndUpdate(req.params.eid, { $set: req.body }, { new: true });
        if (!updated) return res.status(404).json({ status: false, message: "Employee not found" });

        return res.status(200).json({ message: "Employee details updated successfully." });
    } catch (err) {
        console.error("Update employee error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

/**
 * @route   DELETE /api/v1/emp/employees?eid=xxx
 * @desc    Delete employee by query parameter
 * @access  Public (or Protected)
 */
router.delete("/employees", deleteByQueryValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ status: false, message: "Validation error", errors: errors.array() });
    }

    try {
        const { eid } = req.query;
        const deleted = await Employee.findByIdAndDelete(eid);
        if (!deleted) return res.status(404).json({ status: false, message: "Employee not found" });


        return res.status(204).send();
    } catch (err) {
        console.error("Delete employee error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

export default router;
