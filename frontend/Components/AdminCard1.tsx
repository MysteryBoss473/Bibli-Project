'use client'

import React from "react";

interface Livre {
  titre: string;
  auteur: string;
  genre: string;
  note: number;
  isbn: string;
  datePublication: string;
  disponible: boolean;
  image?: string;
}

interface CardProps {
  livre: Livre;
  onSupprimer?: () => void;
  onModifier?: () => void;
}

const AdminCard1: React.FC<CardProps> = ({ livre, onSupprimer, onModifier }) => {
  return (
    <div className="relative card bg-base-100 w-full max-w-md shadow-xl mx-auto p-4">
      {/* Bouton croix */}
      <button
        className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500"
        aria-label="Close"
      >
        ✖
      </button>

      <figure>
        <img
          src={livre.image || "https://via.placeholder.com/400x300?text=Pas+de+couverture"}
          alt={livre.titre}
          className="w-full h-60 object-cover"
        />
      </figure>

      <div className="card-body space-y-2">
        <h2 className="card-title">{livre.titre}</h2>
        <p><strong>Auteur :</strong> {livre.auteur}</p>
        <p><strong>Genre :</strong> {livre.genre}</p>
        <p><strong>Note moyenne :</strong> {livre.note}/5</p>
        <p><strong>ISBN :</strong> {livre.isbn}</p>
        <p><strong>Publié le :</strong> {livre.datePublication}</p>
        <p>
          <strong>Disponibilité :</strong>{" "}
          <span className={livre.disponible ? "text-green-600" : "text-red-600"}>
            {livre.disponible ? "Disponible" : "Indisponible"}
          </span>
        </p>

        {/* Boutons Modifier / Supprimer */}
        <div className="card-actions justify-end mt-4 space-x-2">
          <button className="btn btn-warning" onClick={onModifier}>
            Modifier
          </button>
          <button className="btn btn-error" onClick={onSupprimer}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCard1;
