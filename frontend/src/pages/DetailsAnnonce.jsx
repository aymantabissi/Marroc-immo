import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from '../services/axiosInstance';

const DetailsAnnonce = () => {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const res = await axiosInstance.get(`/annonces/${id}`);
        setAnnonce(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnnonce();
  }, [id]);

  if (!annonce) return <p>Chargement...</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{annonce.titre}</h1>
      <p className="mb-2"><strong>Type de bien:</strong> {annonce.typeBien}</p>
      <p className="mb-2"><strong>Description:</strong> {annonce.description}</p>
      <p className="mb-2"><strong>Superficie:</strong> {annonce.superficie} m²</p>
      <p className="mb-2"><strong>Nombre de pièces:</strong> {annonce.nombrePieces}</p>
      <p className="mb-2"><strong>Prix mensuel:</strong> {annonce.prixMensuel} MAD</p>
      <p className="mb-2">
        <strong>Adresse:</strong>{" "}
        {`${annonce.adresse.rue || ""}, ${annonce.adresse.quartier || ""}, ${annonce.adresse.ville || ""}, ${annonce.adresse.codePostal || ""}, ${annonce.adresse.pays || ""}`}
      </p>
      {annonce.photos && annonce.photos.length > 0 && (
        <div className="flex gap-2 mt-2">
          {annonce.photos.map((url, idx) => (
            <img key={idx} src={url} alt="photo" className="w-24 h-24 object-cover" />
          ))}
        </div>
      )}
      {annonce.proprietaire && (
        <p className="mt-2">
          <strong>Propriétaire:</strong> {annonce.proprietaire.nom} - {annonce.proprietaire.telephone} - {annonce.proprietaire.email}
        </p>
      )}
    </div>
  );
};

export default DetailsAnnonce;
