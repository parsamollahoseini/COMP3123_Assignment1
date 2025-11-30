import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true,
        },
        last_name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        position: {
            type: String,
            required: true,
            trim: true,
        },
        salary: {
            type: Number,
            required: true,
            min: 0,
        },
        date_of_joining: {
            type: Date,
            required: true,
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },

        profile_picture: {  // ADD THIS
            type: String,
            default: '',
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

export default mongoose.model("Employee", EmployeeSchema);
