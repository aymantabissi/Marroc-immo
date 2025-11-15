const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const annonceRoutes = require('./routes/annonceRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/annonces', annonceRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend Maroc Immo fonctionne !");
});

// Connexion MongoDB
connectDB();

// Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));