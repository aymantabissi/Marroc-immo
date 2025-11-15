// backend/test-annonce.js
const mongoose = require('mongoose');
require('dotenv').config();

const AnnonceLocation = require('./models/AnnonceLocation');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connecté');
    
    const testAnnonce = new AnnonceLocation({
      titre: 'Test Appartement',
      description: 'Description test',
      typeBien: 'Appartement',
      superficie: 100,
      nombrePieces: 3,
      prixMensuel: 5000,
      adresse: {
        ville: 'Casablanca',
        pays: 'Maroc'
      }
    });

    const saved = await testAnnonce.save();
    console.log('Annonce sauvegardée:', saved);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });