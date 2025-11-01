const AnnonceLocation = require('../models/AnnonceLocation');

// Ajouter une annonce
exports.ajouterAnnonce = async (req, res) => {
  try {
    const annonce = new AnnonceLocation(req.body);
    const savedAnnonce = await annonce.save();
    res.status(201).json(savedAnnonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Voir toutes les annonces
exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await AnnonceLocation.find();
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Voir une annonce par id
exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await AnnonceLocation.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json(annonce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une annonce
exports.modifierAnnonce = async (req, res) => {
  try {
    const updatedAnnonce = await AnnonceLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // pour retourner l'annonce modifiée
    );
    if (!updatedAnnonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json(updatedAnnonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une annonce
exports.supprimerAnnonce = async (req, res) => {
  try {
    const deletedAnnonce = await AnnonceLocation.findByIdAndDelete(req.params.id);
    if (!deletedAnnonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
