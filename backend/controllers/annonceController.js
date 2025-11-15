const AnnonceLocation = require('../models/AnnonceLocation');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

// Ajouter une annonce avec images
exports.ajouterAnnonce = async (req, res) => {
  try {
    console.log('========= DÉBUT AJOUT ANNONCE =========');
    console.log('Body reçu:', req.body);
    console.log('Files reçus:', req.files ? req.files.length + ' fichier(s)' : 'Aucun fichier');
    
    if (req.multerError) {
      console.log('⚠️ Avertissement Multer:', req.multerError);
    }

    // Validation des champs obligatoires
    if (!req.body.titre || !req.body.description || !req.body.typeBien || 
        !req.body.superficie || !req.body.nombrePieces || !req.body.prixMensuel) {
      return res.status(400).json({ 
        message: 'Tous les champs obligatoires doivent être remplis',
        missing: {
          titre: !req.body.titre,
          description: !req.body.description,
          typeBien: !req.body.typeBien,
          superficie: !req.body.superficie,
          nombrePieces: !req.body.nombrePieces,
          prixMensuel: !req.body.prixMensuel
        }
      });
    }

    const annonceData = {
      titre: req.body.titre,
      description: req.body.description,
      typeBien: req.body.typeBien,
      superficie: Number(req.body.superficie),
      nombrePieces: Number(req.body.nombrePieces),
      prixMensuel: Number(req.body.prixMensuel)
    };

    // Construire l'objet adresse à partir des champs individuels
    if (req.body['adresse[ville]'] || req.body['adresse[pays]']) {
      annonceData.adresse = {
        ville: req.body['adresse[ville]'] || '',
        pays: req.body['adresse[pays]'] || 'Maroc'
      };
    }
    
    // Si des fichiers sont uploadés, ajouter leurs chemins
    if (req.files && req.files.length > 0) {
      annonceData.photos = req.files.map(file => `/uploads/annonces/${file.filename}`);
      console.log('Photos ajoutées:', annonceData.photos);
    }

    console.log('Données finales à sauvegarder:', JSON.stringify(annonceData, null, 2));

    const annonce = new AnnonceLocation(annonceData);
    const savedAnnonce = await annonce.save();
    
    console.log('✅ Annonce sauvegardée avec succès, ID:', savedAnnonce._id);
    console.log('========= FIN AJOUT ANNONCE =========');
    
    res.status(201).json(savedAnnonce);
  } catch (error) {
    console.error('❌ ERREUR lors de l\'ajout:', error.message);
    console.error('Stack:', error.stack);
    
    // Supprimer les fichiers uploadés en cas d'erreur
    if (req.files && req.files.length > 0) {
      console.log('Suppression des fichiers uploadés...');
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
          console.log('Fichier supprimé:', file.filename);
        } catch (err) {
          console.error('Erreur suppression fichier:', err.message);
        }
      });
    }
    
    res.status(500).json({ 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Voir toutes les annonces avec pagination et recherche
exports.getAllAnnonces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || '';
    const typeBien = req.query.typeBien || '';
    
    const skip = (page - 1) * limit;
    
    // Construire le filtre de recherche
    const filter = {};
    
    if (search) {
      filter.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'adresse.ville': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (typeBien) {
      filter.typeBien = typeBien;
    }
    
    // Compter le total
    const total = await AnnonceLocation.countDocuments(filter);
    
    // Récupérer les annonces avec pagination
    const annonces = await AnnonceLocation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      annonces,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAnnonces: total,
      limit
    });
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

// Modifier une annonce avec gestion des images
exports.modifierAnnonce = async (req, res) => {
  try {
    const annonceData = req.body;
    
    // Si de nouvelles images sont uploadées
    if (req.files && req.files.length > 0) {
      // Récupérer l'ancienne annonce pour supprimer les anciennes images
      const oldAnnonce = await AnnonceLocation.findById(req.params.id);
      
      // Supprimer les anciennes images du serveur
      if (oldAnnonce && oldAnnonce.photos) {
        oldAnnonce.photos.forEach(photoPath => {
          const fullPath = path.join(__dirname, '..', photoPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
      
      // Ajouter les nouvelles images
      annonceData.photos = req.files.map(file => `/uploads/annonces/${file.filename}`);
    }

    const updatedAnnonce = await AnnonceLocation.findByIdAndUpdate(
      req.params.id,
      annonceData,
      { new: true }
    );
    
    if (!updatedAnnonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json(updatedAnnonce);
  } catch (error) {
    // Supprimer les nouveaux fichiers en cas d'erreur
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une annonce et ses images
exports.supprimerAnnonce = async (req, res) => {
  try {
    const annonce = await AnnonceLocation.findById(req.params.id);
    
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    
    // Supprimer les images du serveur
    if (annonce.photos && annonce.photos.length > 0) {
      annonce.photos.forEach(photoPath => {
        const fullPath = path.join(__dirname, '..', photoPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    
    await AnnonceLocation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exporter en PDF
exports.exportPDF = async (req, res) => {
  try {
    const annonces = await AnnonceLocation.find();
    
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=annonces.pdf');
    
    doc.pipe(res);
    
    // Titre
    doc.fontSize(20).text('Liste des Annonces', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });
    doc.moveDown(2);
    
    // Annonces
    annonces.forEach((annonce, index) => {
      if (index > 0) doc.moveDown();
      
      doc.fontSize(14).text(`${index + 1}. ${annonce.titre}`, { underline: true });
      doc.fontSize(10);
      doc.text(`Type: ${annonce.typeBien}`);
      doc.text(`Prix: ${annonce.prixMensuel} MAD/mois`);
      doc.text(`Superficie: ${annonce.superficie} m²`);
      doc.text(`Pièces: ${annonce.nombrePieces}`);
      doc.text(`Ville: ${annonce.adresse?.ville || 'Non spécifié'}`);
      doc.text(`Description: ${annonce.description.substring(0, 100)}...`);
      doc.moveDown();
      
      // Nouvelle page tous les 5 éléments
      if ((index + 1) % 5 === 0 && index < annonces.length - 1) {
        doc.addPage();
      }
    });
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exporter en CSV
exports.exportCSV = async (req, res) => {
  try {
    const annonces = await AnnonceLocation.find();
    
    const fields = [
      { label: 'Titre', value: 'titre' },
      { label: 'Type', value: 'typeBien' },
      { label: 'Prix (MAD)', value: 'prixMensuel' },
      { label: 'Superficie (m²)', value: 'superficie' },
      { label: 'Pièces', value: 'nombrePieces' },
      { label: 'Ville', value: 'adresse.ville' },
      { label: 'Pays', value: 'adresse.pays' },
      { label: 'Description', value: 'description' }
    ];
    
    const parser = new Parser({ fields, delimiter: ';' });
    const csv = parser.parse(annonces);
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=annonces.csv');
    res.send('\uFEFF' + csv); // BOM pour Excel
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};