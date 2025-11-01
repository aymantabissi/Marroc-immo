const mongoose = require('mongoose');

const annonceLocationSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  typeBien: { type: String, enum: ['Appartement','Maison','Studio','Villa','Bureau','Autre'], required: true },
  superficie: { type: Number, required: true },
  nombrePieces: { type: Number, required: true },
  adresse: {
    rue: String,
    ville: String,
    codePostal: String,
    quartier: String,
    pays: { type: String, default: "Maroc" }
  },
  prixMensuel: { type: Number, required: true },
  disponible: { type: Boolean, default: true },
  photos: [String],
  datePublication: { type: Date, default: Date.now },
  proprietaire: {
    nom: String,
    email: String,
    telephone: String
  },
  demandesVisite: [
    {
      clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      dateDemande: Date,
      statut: { type: String, enum: ['En attente', 'Confirmée', 'Annulée'], default: 'En attente' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('AnnonceLocation', annonceLocationSchema);
