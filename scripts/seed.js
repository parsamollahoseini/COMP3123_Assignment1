// scripts/seed.js
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import Employee from "../src/models/Employee.js";

const run = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ MONGO_URI missing in .env");
        process.exit(1);
    }

    await mongoose.connect(uri);

    // Clean existing data (safe for local dev)
    await Promise.all([User.deleteMany({}), Employee.deleteMany({})]);

    // Seed user (matches assignment samples)
    const hashed = await bcrypt.hash("password123", 10);
    const user = await User.create({
        username: "johndoe",
        email: "johndoe@example.com",
        password: hashed,
    });

    // Seed employees
    const emps = await Employee.insertMany([
        {
            first_name: "Jane",
            last_name: "Doe",
            email: "jane.doe@example.com",
            position: "Software Engineer",
            salary: 90000,
            date_of_joining: new Date("2023-08-01T00:00:00.000Z"),
            department: "Engineering",
        },
        {
            first_name: "John",
            last_name: "Smith",
            email: "john.smith@example.com",
            position: "Product Manager",
            salary: 110000,
            date_of_joining: new Date("2023-07-15T00:00:00.000Z"),
            department: "Product",
        },
    ]);

    console.log("✅ Seed complete:");
    console.log("  user_id:", user._id.toString());
    console.log("  employee_ids:", emps.map((e) => e._id.toString()).join(", "));

    await mongoose.disconnect();
};

run().catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
});
