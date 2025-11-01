import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AjouterAnnonce = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titre: '',
    description: '',
    typeBien: 'Appartement',
    superficie: '',
    nombrePieces: '',
    prixMensuel: ''
  });

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axiosInstance.post('/annonces', form);
    navigate('/');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ajouter une annonce</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} className="border p-2"/>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2"/>
        <select name="typeBien" value={form.typeBien} onChange={handleChange} className="border p-2">
          <option>Appartement</option>
          <option>Maison</option>
          <option>Studio</option>
          <option>Villa</option>
          <option>Bureau</option>
          <option>Autre</option>
        </select>
        <input name="superficie" type="number" placeholder="Superficie (m²)" value={form.superficie} onChange={handleChange} className="border p-2"/>
        <input name="nombrePieces" type="number" placeholder="Nombre de pièces" value={form.nombrePieces} onChange={handleChange} className="border p-2"/>
        <input name="prixMensuel" type="number" placeholder="Prix mensuel" value={form.prixMensuel} onChange={handleChange} className="border p-2"/>
        <button type="submit" className="bg-green-500 text-white p-2 mt-2">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterAnnonce;
