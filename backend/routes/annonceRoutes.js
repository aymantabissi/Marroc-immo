const express = require('express');
const router = express.Router();
const multer = require('multer');
const annonceController = require('../controllers/annonceController');
const upload = require('../config/multer');

// Middleware pour gérer les erreurs de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Fichier trop volumineux (max 5MB)' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Routes d'export (avant les routes avec :id pour éviter les conflits)
router.get('/export/pdf', annonceController.exportPDF);
router.get('/export/csv', annonceController.exportCSV);

// CRUD Annonces avec upload d'images (max 5 photos)
router.post('/', (req, res, next) => {
  upload.array('photos', 5)(req, res, (err) => {
    if (err) {
      console.error('Erreur Multer:', err.message);
      req.multerError = err.message;
    }
    next();
  });
}, annonceController.ajouterAnnonce);

router.get('/', annonceController.getAllAnnonces);
router.get('/:id', annonceController.getAnnonceById);

router.put('/:id', (req, res, next) => {
  upload.array('photos', 5)(req, res, (err) => {
    if (err) {
      console.error('Erreur Multer:', err.message);
      req.multerError = err.message;
    }
    next();
  });
}, annonceController.modifierAnnonce);

router.delete('/:id', annonceController.supprimerAnnonce);

module.exports = router;