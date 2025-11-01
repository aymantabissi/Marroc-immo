import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../services/axiosInstance';

const ModifierAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titre: "",
    description: "",
    typeBien: "Appartement",
    superficie: "",
    nombrePieces: "",
    prixMensuel: "",
  });

  // Charger les données de l'annonce
  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const res = await axiosInstance.get(`/annonces/${id}`);
        const { titre, description, typeBien, superficie, nombrePieces, prixMensuel } = res.data;
        setForm({ titre, description, typeBien, superficie, nombrePieces, prixMensuel });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnnonce();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/annonces/${id}`, form);
      navigate("/annonces");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier l'annonce</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          name="titre"
          placeholder="Titre"
          value={form.titre}
          onChange={handleChange}
          className="border p-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2"
        />
        <select
          name="typeBien"
          value={form.typeBien}
          onChange={handleChange}
          className="border p-2"
        >
          <option>Appartement</option>
          <option>Maison</option>
          <option>Studio</option>
          <option>Villa</option>
          <option>Bureau</option>
          <option>Autre</option>
        </select>
        <input
          name="superficie"
          type="number"
          placeholder="Superficie (m²)"
          value={form.superficie}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="nombrePieces"
          type="number"
          placeholder="Nombre de pièces"
          value={form.nombrePieces}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="prixMensuel"
          type="number"
          placeholder="Prix mensuel"
          value={form.prixMensuel}
          onChange={handleChange}
          className="border p-2"
        />
        <button type="submit" className="bg-yellow-500 text-white p-2 mt-2">
          Modifier
        </button>
      </form>
    </div>
  );
};

export default ModifierAnnonce;
