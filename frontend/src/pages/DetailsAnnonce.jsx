import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Home, MapPin, Maximize2, DoorOpen, 
  DollarSign, User, Phone, Mail, Calendar, ChevronLeft, ChevronRight
} from "lucide-react";
import axiosInstance from '../services/axiosInstance';

const DetailsAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/annonces/${id}`);
        setAnnonce(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnonce();
  }, [id]);

  const nextImage = () => {
    if (annonce?.photos && annonce.photos.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === annonce.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (annonce?.photos && annonce.photos.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? annonce.photos.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          Annonce non trouvée
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header avec bouton retour */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/annonces')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour aux annonces</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie photos */}
            {annonce.photos && annonce.photos.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={`${axiosInstance.defaults.baseURL}${annonce.photos[currentImageIndex]}`}
                    alt={`Photo ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {annonce.photos.length > 1 && (
                    <>
                      {/* Boutons navigation */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                      
                      {/* Indicateur */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                        {currentImageIndex + 1} / {annonce.photos.length}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Miniatures */}
                {annonce.photos.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {annonce.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'border-blue-600 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={`${axiosInstance.defaults.baseURL}${photo}`}
                          alt={`Miniature ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Home className="w-24 h-24 text-gray-400" />
                </div>
              </div>
            )}

            {/* Titre et type */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{annonce.titre}</h1>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 whitespace-nowrap">
                  {annonce.typeBien}
                </span>
              </div>

              {/* Prix principal */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-2">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <span className="text-4xl font-bold text-green-900">
                      {annonce.prixMensuel.toLocaleString()}
                    </span>
                    <span className="text-xl text-green-700 ml-2">MAD</span>
                    <span className="text-gray-600 ml-2">/ mois</span>
                  </div>
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Superficie</p>
                      <p className="text-2xl font-bold text-blue-900">{annonce.superficie} m²</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DoorOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Pièces</p>
                      <p className="text-2xl font-bold text-purple-900">{annonce.nombrePieces}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Localisation */}
              {annonce.adresse && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Localisation</p>
                      <p className="text-gray-900 text-lg">
                        {[
                          annonce.adresse.rue,
                          annonce.adresse.quartier,
                          annonce.adresse.ville,
                          annonce.adresse.codePostal,
                          annonce.adresse.pays
                        ].filter(Boolean).join(', ') || 'Non spécifiée'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {annonce.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Carte propriétaire */}
            {annonce.proprietaire && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Propriétaire</p>
                    <p className="text-lg font-bold text-gray-900">{annonce.proprietaire.nom}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Téléphone</p>
                      <a 
                        href={`tel:${annonce.proprietaire.telephone}`}
                        className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                      >
                        {annonce.proprietaire.telephone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <a 
                        href={`mailto:${annonce.proprietaire.email}`}
                        className="text-gray-900 font-medium hover:text-blue-600 transition-colors break-all"
                      >
                        {annonce.proprietaire.email}
                      </a>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg">
                  Contacter le propriétaire
                </button>
              </div>
            )}

            {/* Informations supplémentaires */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Publié le {new Date(annonce.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Home className="w-4 h-4" />
                  <span>ID: {annonce._id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsAnnonce;