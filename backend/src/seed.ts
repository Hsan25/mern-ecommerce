import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "@model/user.model";
// Database connection
import dotenv from "dotenv";
dotenv.config();

const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
const password = process.env.ADMIN_PASSWORD || "admin123456";
const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "");
    const existingAdmin = await User.findOne({ email });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new User({
        name: "admin",
        email,
        password: hashedPassword,
        role: "ADMIN", // Ensure the role field exists
      });
      await admin.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
