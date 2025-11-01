const express = require('express');
const router = express.Router();
const annonceController = require('../controllers/annonceController');

// CRUD Annonces
router.post('/', annonceController.ajouterAnnonce);           // Ajouter
router.get('/', annonceController.getAllAnnonces);            // Voir toutes
router.get('/:id', annonceController.getAnnonceById);         // Voir détail
router.put('/:id', annonceController.modifierAnnonce);        // Modifier
router.delete('/:id', annonceController.supprimerAnnonce);    // Supprimer

module.exports = router;
