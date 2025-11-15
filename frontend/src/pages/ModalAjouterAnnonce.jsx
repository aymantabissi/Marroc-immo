import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';

const ModalAjouterAnnonce = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    typeBien: 'Appartement',
    superficie: '',
    nombrePieces: '',
    prixMensuel: '',
    ville: ''
  });
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + photos.length > 5) {
      alert('Vous pouvez uploader maximum 5 images');
      return;
    }

    setPhotos([...photos, ...files]);

    // Créer des previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    
    // Libérer la mémoire du preview
    URL.revokeObjectURL(photoPreviews[index]);
    
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer FormData pour envoyer les fichiers
      const formData = new FormData();
      
      // Ajouter les champs du formulaire
      formData.append('titre', form.titre);
      formData.append('description', form.description);
      formData.append('typeBien', form.typeBien);
      formData.append('superficie', Number(form.superficie));
      formData.append('nombrePieces', Number(form.nombrePieces));
      formData.append('prixMensuel', Number(form.prixMensuel));
      
      // Ajouter l'adresse (structure imbriquée)
      if (form.ville) {
        formData.append('adresse[ville]', form.ville);
        formData.append('adresse[pays]', 'Maroc');
      }

      // Ajouter les photos
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      // Log pour déboguer
      console.log('Données envoyées:', {
        titre: form.titre,
        description: form.description,
        typeBien: form.typeBien,
        superficie: form.superficie,
        nombrePieces: form.nombrePieces,
        prixMensuel: form.prixMensuel,
        ville: form.ville,
        photosCount: photos.length
      });

      await axiosInstance.post('/annonces', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Réinitialiser le formulaire
      setForm({
        titre: '',
        description: '',
        typeBien: 'Appartement',
        superficie: '',
        nombrePieces: '',
        prixMensuel: '',
        ville: ''
      });
      setPhotos([]);
      setPhotoPreviews([]);

      onSuccess();
      onClose();
    } catch (err) {
      alert('Erreur lors de l\'ajout de l\'annonce');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle Annonce</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Upload Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Max 5)
            </label>
            
            {/* Zone de drop */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
                disabled={photos.length >= 5}
              />
              <label
                htmlFor="photo-upload"
                className={`cursor-pointer ${photos.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {photos.length >= 5
                    ? 'Maximum 5 images atteint'
                    : 'Cliquez pour ajouter des images ou glissez-déposez'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </label>
            </div>

            {/* Previews */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              name="titre"
              type="text"
              required
              placeholder="Ex: Appartement moderne au centre-ville"
              value={form.titre}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              placeholder="Décrivez votre bien en détail..."
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Type et Ville */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de bien <span className="text-red-500">*</span>
              </label>
              <select
                name="typeBien"
                value={form.typeBien}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option>Appartement</option>
                <option>Maison</option>
                <option>Studio</option>
                <option>Villa</option>
                <option>Bureau</option>
                <option>Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                name="ville"
                type="text"
                placeholder="Ex: Casablanca"
                value={form.ville}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Superficie, Pièces, Prix */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Superficie (m²) <span className="text-red-500">*</span>
              </label>
              <input
                name="superficie"
                type="number"
                required
                placeholder="100"
                value={form.superficie}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de pièces <span className="text-red-500">*</span>
              </label>
              <input
                name="nombrePieces"
                type="number"
                required
                placeholder="3"
                value={form.nombrePieces}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix mensuel (MAD) <span className="text-red-500">*</span>
              </label>
              <input
                name="prixMensuel"
                type="number"
                required
                placeholder="5000"
                value={form.prixMensuel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter l\'annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAjouterAnnonce;