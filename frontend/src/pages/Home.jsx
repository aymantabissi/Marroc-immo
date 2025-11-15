import { useState, useEffect } from "react";
import HomeImage from "../assets/HomeImage.jpg";
import axiosInstance from "../services/axiosInstance";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const res = await axiosInstance.get("/annonces");
        if (Array.isArray(res.data)) {
          const annoncesWithFullImageUrl = res.data.map((annonce) => ({
            ...annonce,
            photos:
              annonce.photos?.map((photo) =>
                photo.startsWith("http") ? photo : `http://localhost:5000${photo}`
              ) || [],
          }));
          setAnnonces(annoncesWithFullImageUrl);
        } else {
          setAnnonces([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des annonces:", err);
      }
    };
    fetchAnnonces();
  }, []);

  return (
    <div>
      {/* === Hero Header === */}
      <header className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src={HomeImage}
          alt="Home"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-blue-900/40"></div>

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200">Trouvez une maison</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-100">qui S'adapte</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-blue-100 to-white">parfaitement</span>
          </h1>
          <p className={`text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 font-light tracking-wide transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Nous sommes un portail immobilier qui vous aidera à trouver 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold"> le logement de vos rêves</span>.
          </p>
          <button className={`group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 text-white font-semibold text-lg overflow-hidden transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:shadow-2xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="relative z-10 flex items-center gap-2">
              Découvrir nos biens
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"></div>
          </button>
        </div>
      </header>

      {/* === Découvrez nos projets Section === */}
      <section className="py-20 bg-gray-100 text-gray-900">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Découvrez nos projets</h2>
          <hr className="w-24 border-t-2 border-gray-400 mx-auto mt-4" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6 px-4">
          {Array.isArray(annonces) && annonces.length > 0 ? (
            annonces.map((a) => <CardAnnonce key={a._id} annonce={a} />)
          ) : (
            <p className="text-center col-span-3 text-gray-500">Aucune annonce disponible pour le moment</p>
          )}
        </div>
      </section>
    </div>
  );
}

// === Composant CardAnnonce avec slider d'images ===
function CardAnnonce({ annonce }) {
  const images = annonce.photos?.slice(0, 5) || [];
  const [imgIndex, setImgIndex] = useState(0);

  const prevImage = () =>
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative w-full h-40">
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIndex]}
              alt={annonce.titre}
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/300x200?text=Image+Non+Disponible")
              }
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60 transition"
                >
                  &#10094;
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60 transition"
                >
                  &#10095;
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
            Pas d'image
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between h-56">
        <div>
          <h3 className="text-lg font-semibold mb-1">{annonce.titre}</h3>
          <p className="text-gray-700 text-sm mb-1">
            {annonce.description?.substring(0, 40)}...
          </p>
          <p className="text-gray-700 text-sm mb-1">
            Surface: <span className="font-semibold">{annonce.superficie} m²</span>
          </p>
          <p className="text-gray-900 font-semibold text-sm">
            Prix: {annonce.prixMensuel?.toLocaleString()} MAD
          </p>
        </div>
        <button className="mt-3 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
          Voir Détails
        </button>
      </div>
    </div>
  );
}
