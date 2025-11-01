// backend/createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@marocimmo.com" });
    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin123!", salt);

    const admin = new User({
      name: "Admin Maroc Immo",
      email: "admin@marocimmo.com",
      password: hashedPassword,
      role: "admin",
      phone: "0000000000",
      gender: "other",
      address: "Casablanca",
      country: "Morocco"
    });

    await admin.save();
    console.log("Admin created successfully!");
    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
