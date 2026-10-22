import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const staffPassword = await bcrypt.hash("staff123", 10);

    await User.findOneAndUpdate(
      { email: "admin@smartcampus.com" },
      {
        name: "SmartCampus Admin",
        email: "admin@smartcampus.com",
        password: adminPassword,
        role: "admin",
        department: "Administration"
      },
      { upsert: true, new: true }
    );

    await User.findOneAndUpdate(
      { email: "staff@smartcampus.com" },
      {
        name: "SmartCampus Staff",
        email: "staff@smartcampus.com",
        password: staffPassword,
        role: "staff",
        department: "Maintenance"
      },
      { upsert: true, new: true }
    );

    console.log("Admin created:");
    console.log("Email: admin@smartcampus.com");
    console.log("Password: admin123");

    console.log("Staff created:");
    console.log("Email: staff@smartcampus.com");
    console.log("Password: staff123");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedUsers();