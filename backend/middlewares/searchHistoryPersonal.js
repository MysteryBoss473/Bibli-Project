var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken');
var config = require('../config');
var connection = require("../database");

// Recherche de livres empruntés ou rendus avec filtre
const searchBorrowedOrReturnedBooksByUser = async (req, res) => {
    try {
        const { idUtilisateur, recherche } = req.query;

        if (!idUtilisateur || !recherche) {
            return res.status(400).json({
                "Error": true,
                "Message": "Paramètres 'idUtilisateur' et 'recherche' requis"
            });
        }

        const searchTerm = `%${recherche}%`;

        let query = `
            SELECT 
                l.ISBN,
                l.Titre,
                l.Auteur,
                l.Genre,
                COALESCE(AVG(n.Note), 0) AS Note,
                CASE 
                    WHEN l.Exemplaires > 0 THEN true
                    ELSE false
                END AS Disponible
            FROM 
                emprunt e
            JOIN livre l ON e.ISBN = l.ISBN
            LEFT JOIN notation n ON l.ISBN = n.ISBN
            WHERE 
                e.idUtilisateur = ?
                AND e.Statut IN ('emprunté', 'rendu')
                AND (
                    l.ISBN LIKE ? OR
                    l.Titre LIKE ? OR
                    l.Auteur LIKE ? OR
                    l.Genre LIKE ?
                )
            GROUP BY 
                l.ISBN, l.Titre, l.Auteur, l.Genre, l.Exemplaires
        `;

        const params = [idUtilisateur, searchTerm, searchTerm, searchTerm, searchTerm];

        connection.query(query, params, function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    "Error": true,
                    "Message": "Erreur lors de la requête"
                });
            }

            res.json({
                "Error": false,
                "Message": "Résultats trouvés",
                "LivresFiltres": results
            });
        });

    } catch (error) {
        res.status(500).json({ "Error": true, "Message": error.message });
    }
};

module.exports = searchBorrowedOrReturnedBooksByUser;
