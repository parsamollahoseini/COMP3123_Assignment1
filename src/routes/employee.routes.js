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
import upload from "../middleware/upload.js";  // ADD THIS

const router = express.Router();

router.use(authOptional);

/**
 * @route   GET /api/v1/emp/employees
 * @desc    Get all employees
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
            profile_picture: emp.profile_picture || '',  // ADD THIS
        }));
        return res.status(200).json(formatted);
    } catch (err) {
        console.error("Get all employees error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

/**
 * @route   GET /api/v1/emp/employees/search
 * @desc    Search employees by department or position
 * ADD THIS ENTIRE ROUTE
 */
router.get("/employees/search", async (req, res) => {
    try {
        const { department, position } = req.query;

        let query = {};

        if (department) {
            query.department = { $regex: department, $options: 'i' };
        }

        if (position) {
            query.position = { $regex: position, $options: 'i' };
        }

        const employees = await Employee.find(query, { __v: 0 }).lean();

        const formatted = employees.map((emp) => ({
            employee_id: emp._id.toString(),
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            position: emp.position,
            salary: emp.salary,
            date_of_joining: emp.date_of_joining,
            department: emp.department,
            profile_picture: emp.profile_picture || '',
        }));

        return res.status(200).json({
            status: true,
            count: formatted.length,
            data: formatted
        });
    } catch (err) {
        console.error("Search employees error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

/**
 * @route   POST /api/v1/emp/employees
 * @desc    Create a new employee with profile picture
 * UPDATE THIS - Add upload.single('profile_picture')
 */
router.post("/employees", upload.single('profile_picture'), createEmployeeValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ status: false, message: "Validation error", errors: errors.array() });
    }

    try {
        const employeeData = {
            ...req.body,
            profile_picture: req.file ? `/uploads/${req.file.filename}` : ''  // ADD THIS
        };

        const emp = await Employee.create(employeeData);
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
            profile_picture: emp.profile_picture || '',  // ADD THIS
        });
    } catch (err) {
        console.error("Get employee by ID error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
});

/**
 * @route   PUT /api/v1/emp/employees/:eid
 * @desc    Update employee details by ID with profile picture
 * UPDATE THIS - Add upload.single('profile_picture')
 */
router.put("/employees/:eid", upload.single('profile_picture'), updateEmployeeValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ status: false, message: "Validation error", errors: errors.array() });
    }

    try {
        const updateData = { ...req.body };

        if (req.file) {  // ADD THIS
            updateData.profile_picture = `/uploads/${req.file.filename}`;
        }

        const updated = await Employee.findByIdAndUpdate(
            req.params.eid,
            { $set: updateData },
            { new: true }
        );
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