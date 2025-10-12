import mongoose from "mongoose";

/**
 * Connect to MongoDB using Mongoose
 */
export const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ Error: MONGO_URI is missing in .env file");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            autoIndex: true,
        });
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};
