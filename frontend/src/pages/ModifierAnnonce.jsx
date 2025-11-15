import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';

const ModalModifierAnnonce = ({ isOpen, onClose, onSuccess, annonceId }) => {
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
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Charger les données de l'annonce
  useEffect(() => {
    if (isOpen && annonceId) {
      fetchAnnonce();
    }
  }, [isOpen, annonceId]);

  const fetchAnnonce = async () => {
    try {
      setLoadingData(true);
      const res = await axiosInstance.get(`/annonces/${annonceId}`);
      const data = res.data;
      
      setForm({
        titre: data.titre || '',
        description: data.description || '',
        typeBien: data.typeBien || 'Appartement',
        superficie: data.superficie || '',
        nombrePieces: data.nombrePieces || '',
        prixMensuel: data.prixMensuel || '',
        ville: data.adresse?.ville || ''
      });

      // Charger les photos existantes
      if (data.photos && data.photos.length > 0) {
        setExistingPhotos(data.photos);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      alert('Erreur lors du chargement de l\'annonce');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    const totalPhotos = existingPhotos.length + photos.length + files.length;
    if (totalPhotos > 5) {
      alert('Vous pouvez avoir maximum 5 images au total');
      return;
    }

    setPhotos([...photos, ...files]);

    // Créer des previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removeNewPhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    
    // Libérer la mémoire du preview
    URL.revokeObjectURL(photoPreviews[index]);
    
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const removeExistingPhoto = (index) => {
    const newExistingPhotos = existingPhotos.filter((_, i) => i !== index);
    setExistingPhotos(newExistingPhotos);
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
      
      // Ajouter l'adresse
      if (form.ville) {
        formData.append('adresse[ville]', form.ville);
        formData.append('adresse[pays]', 'Maroc');
      }

      // Ajouter les nouvelles photos seulement si on en a
      if (photos.length > 0) {
        photos.forEach(photo => {
          formData.append('photos', photo);
        });
      }

      // Log pour déboguer
      console.log('Données envoyées:', {
        titre: form.titre,
        description: form.description,
        typeBien: form.typeBien,
        superficie: form.superficie,
        nombrePieces: form.nombrePieces,
        prixMensuel: form.prixMensuel,
        ville: form.ville,
        newPhotosCount: photos.length
      });

      await axiosInstance.put(`/annonces/${annonceId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Réinitialiser
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      alert('Erreur lors de la modification de l\'annonce');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    setExistingPhotos([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">Modifier l'Annonce</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading || loadingData}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {loadingData ? (
          <div className="p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* Modal Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Photos existantes */}
            {existingPhotos.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos actuelles
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {existingPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`${axiosInstance.defaults.baseURL}${photo}`}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload nouvelles photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ajouter de nouvelles photos (Max 5 au total)
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
                  disabled={existingPhotos.length + photos.length >= 5}
                />
                <label
                  htmlFor="photo-upload"
                  className={`cursor-pointer ${
                    existingPhotos.length + photos.length >= 5 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {existingPhotos.length + photos.length >= 5
                      ? 'Maximum 5 images atteint'
                      : 'Cliquez pour ajouter des images ou glissez-déposez'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF jusqu'à 5MB
                  </p>
                </label>
              </div>

              {/* Previews des nouvelles photos */}
              {photoPreviews.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mt-4 mb-2">
                    Nouvelles photos à ajouter
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-blue-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Modification en cours...' : 'Modifier l\'annonce'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalModifierAnnonce;