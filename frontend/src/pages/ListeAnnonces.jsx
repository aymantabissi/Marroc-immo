import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, Home, MapPin, DollarSign } from 'lucide-react';

const ListeAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get('/annonces');
      setAnnonces(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des annonces');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const supprimerAnnonce = async (id) => {
    if (window.confirm("Voulez-vous supprimer cette annonce ?")) {
      try {
        await axiosInstance.delete(`/annonces/${id}`);
        fetchAnnonces();
      } catch (err) {
        alert('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Liste des annonces</h1>
          <p className="text-gray-600 mt-1">{annonces.length} annonce(s) disponible(s)</p>
        </div>
        <Link
  to="ajouter"  // <- chemin RELATIF à /admin/annonces
  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
>
  <Plus className="w-5 h-5" />
  Nouvelle annonce
</Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Prix Mensuel
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {annonces.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Home className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium">Aucune annonce disponible</p>
                    <p className="text-sm mt-1">Commencez par créer votre première annonce</p>
                  </td>
                </tr>
              ) : (
                annonces.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Home className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{a.titre}</p>
                          <p className="text-sm text-gray-500">{a.description?.substring(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {a.typeBien}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-900 font-semibold">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        {a.prixMensuel} MAD
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {a.ville || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`${a._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir détails">
  <Eye className="w-5 h-5" />
</Link>
                        <Link
                          to={`/modifier/${a._id}`}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 group"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Link>
                        <button
                          onClick={() => supprimerAnnonce(a._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Footer */}
      {annonces.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Total des annonces</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{annonces.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <p className="text-sm text-green-600 font-medium">Prix moyen</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {Math.round(annonces.reduce((acc, a) => acc + a.prixMensuel, 0) / annonces.length)} MAD
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Types disponibles</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {new Set(annonces.map(a => a.typeBien)).size}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeAnnonces;