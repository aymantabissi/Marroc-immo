// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_EXPIRES = "1d";

const register = async (req, res) => {
  try {
    const { name, email, password, phone, gender, address, country, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashed, phone, gender, address, country,
      role: role === "admin" ? "admin" : "client"
    });

    // create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // return safe user (no password)
    const { password: _p, ...userSafe } = user.toObject();
    res.status(201).json({ user: userSafe, token });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request body:", req.body);  // <--- vérifie ici

    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    console.log("User found:", user); // <--- vérifier si utilisateur existe

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });

    const { password: _p, ...userSafe } = user.toObject();
    res.json({ user: userSafe, token });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: err.message });
  }
};


// Export en CommonJS
module.exports = { register, login };
