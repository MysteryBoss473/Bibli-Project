'use client'

import React, { useState } from "react";
import axios from "axios";

interface Livre {
  titre: string;
  auteur: string;
  genre: string;
  note: number;
  isbn: string;
  datePublication: string;
  disponible: boolean;
}

interface CardProps {
  livre: Livre;
  idUtilisateur: string; // 👈 Ajout ici
}

const Card: React.FC<CardProps> = ({ livre, idUtilisateur }) => {
  const [reserve, setReserve] = useState(false);
  const [rating, setRating] = useState(livre.note);
  const [hasRated, setHasRated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

const Card: React.FC<CardProps> = ({ livre, idUtilisateur }) => {
  const [reserve, setReserve] = useState(false);
  const [rating, setRating] = useState(livre.note);
  const [hasRated, setHasRated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReservationClick = async () => {
    if (reserve || !livre.disponible) return;

    const today = new Date();
    const limiteRetour = new Date();
    limiteRetour.setMonth(today.getMonth() + 1);

    const addLoan = {
      statut: "reservé",
      dateEmprunt: today.toISOString(),
      limiteRetour: limiteRetour.toISOString(),
      isbn: livre.isbn,
      idUtilisateur: idUtilisateur,
    };

    try {
      await axios.post("http://localhost:4400/emprunt", addLoan);
      setReserve(true);
    } catch (err) {
      console.error("Erreur lors de la réservation :", err);
      alert("Erreur lors de la réservation. Veuillez réessayer.");
    }
  };


  const handleStarClick = async (index: number) => {
    if (hasRated) return;

    const selectedRating = index + 1;
    setRating(selectedRating);
    setHasRated(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post('http://localhost:4400/note', {
        isbn: livre.isbn,
        note: selectedRating,
        idUtilisateur: idUtilisateur,
      });

      setSuccess(true);
    } catch (err) {
      console.error('Erreur lors de l’envoi de la note :', err);
      setError("Impossible d'enregistrer votre note. Veuillez réessayer.");
      setHasRated(false);
    }
  };

  return (
    <div className="relative card bg-base-100 w-full max-w-md shadow-xl mx-auto p-4">
      <button
        className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500"
        aria-label="Close"
      >
        ✖
      </button>

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

        {/* Notation */}
        <div>
          <strong>Votre note :</strong>
          <div className="flex items-center space-x-1 mt-1">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`cursor-pointer text-xl ${
                  index < rating ? "text-yellow-400" : "text-gray-400"
                } ${hasRated ? "pointer-events-none opacity-50" : ""}`}
                onClick={() => handleStarClick(index)}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
          </div>
          {hasRated && success && (
            <p className="text-xs text-green-600 italic mt-1">
              Votre note a été enregistrée.
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 italic mt-1">{error}</p>
          )}
        </div>

        {/* Réservation */}
        <div className="card-actions justify-end mt-4">
          <button
            className={`btn ${reserve ? "btn-error" : "btn-primary"}`}
            disabled={!livre.disponible}
            onClick={handleReservationClick}
          >
            {reserve ? "Annuler la réservation" : "Réserver"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
