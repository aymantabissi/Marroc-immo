import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Link } from 'react-router-dom';
import { 
  Eye, Edit, Trash2, Plus, Home, MapPin, DollarSign, 
  Search, Download, FileText, FileSpreadsheet,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import ModalAjouterAnnonce from './ModalAjouterAnnonce';
import ModalModifierAnnonce from './ModifierAnnonce';
import ModalConfirmationSupprimer from '../components/ModalConfirmationSupprimer';

const ListeAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModalAjout, setShowModalAjout] = useState(false);
  const [showModalModif, setShowModalModif] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedAnnonceId, setSelectedAnnonceId] = useState(null);
  const [selectedAnnonceTitre, setSelectedAnnonceTitre] = useState('');
  const [loadingDelete, setLoadingDelete] = useState(false);
  
  // Pagination et recherche
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnnonces, setTotalAnnonces] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchAnnonces = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get('/annonces', {
        params: {
          page,
          limit: 8,
          search
        }
      });
      setAnnonces(res.data.annonces);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalAnnonces(res.data.totalAnnonces);
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
        fetchAnnonces(currentPage, searchTerm);
      } catch (err) {
        alert('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  const openModalDelete = (id, titre) => {
    setSelectedAnnonceId(id);
    setSelectedAnnonceTitre(titre);
    setShowModalDelete(true);
  };

  const closeModalDelete = () => {
    setShowModalDelete(false);
    setSelectedAnnonceId(null);
    setSelectedAnnonceTitre('');
  };

  const confirmDelete = async () => {
    try {
      setLoadingDelete(true);
      await axiosInstance.delete(`/annonces/${selectedAnnonceId}`);
      closeModalDelete();
      fetchAnnonces(currentPage, searchTerm);
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
    fetchAnnonces(1, searchInput);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAnnonces(page, searchTerm);
  };

  const handleExport = async (format) => {
    try {
      const response = await axiosInstance.get(`/annonces/export/${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `annonces.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(`Erreur lors de l'export ${format.toUpperCase()}`);
      console.error(err);
    }
  };

  const openModalModif = (id) => {
    setSelectedAnnonceId(id);
    setShowModalModif(true);
  };

  const closeModalModif = () => {
    setShowModalModif(false);
    setSelectedAnnonceId(null);
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
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Liste des annonces</h1>
          <p className="text-gray-600 mt-1">{totalAnnonces} annonce(s) disponible(s)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FileText className="w-5 h-5" />
            Export PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModalAjout(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nouvelle annonce
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher par titre, description ou ville..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Rechercher
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSearchTerm('');
                fetchAnnonces(1, '');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200"
            >
              Réinitialiser
            </button>
          )}
        </form>
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
                    <p className="text-lg font-medium">
                      {searchTerm ? 'Aucun résultat trouvé' : 'Aucune annonce disponible'}
                    </p>
                    <p className="text-sm mt-1">
                      {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre première annonce'}
                    </p>
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
                        {a.adresse?.ville || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`${a._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir détails">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => openModalModif(a._id)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openModalDelete(a._id, a.titre)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            // Afficher seulement quelques pages autour de la page courante
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              (page === currentPage - 2 && page > 1) ||
              (page === currentPage + 2 && page < totalPages)
            ) {
              return <span key={page} className="px-2">...</span>;
            }
            return null;
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stats Footer */}
      {annonces.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Total des annonces</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{totalAnnonces}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <p className="text-sm text-green-600 font-medium">Page actuelle</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {currentPage} / {totalPages}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Annonces par page</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">8</p>
          </div>
        </div>
      )}

      {/* Modal Components */}
      <ModalAjouterAnnonce
        isOpen={showModalAjout}
        onClose={() => setShowModalAjout(false)}
        onSuccess={() => {
          setShowModalAjout(false);
          fetchAnnonces(1, searchTerm);
        }}
      />

      <ModalModifierAnnonce
        isOpen={showModalModif}
        onClose={closeModalModif}
        onSuccess={() => {
          closeModalModif();
          fetchAnnonces(currentPage, searchTerm);
        }}
        annonceId={selectedAnnonceId}
      />

      <ModalConfirmationSupprimer
        isOpen={showModalDelete}
        onClose={closeModalDelete}
        onConfirm={confirmDelete}
        titre={selectedAnnonceTitre}
        loading={loadingDelete}
      />
    </div>
  );
};

export default ListeAnnonces;