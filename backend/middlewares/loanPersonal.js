var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken');
var config = require('../config');
var connection = require("../database");

// Fonction pour récupérer les livres réservés d'un utilisateur
const getReservedBooksByUser = async (req, res) => {
    try {
        const { idUtilisateur } = req.params;

        if (!idUtilisateur) {
            return res.status(400).json({
                "Error": true,
                "Message": "idUtilisateur requis"
            });
        }

        // Requête SQL
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
                AND e.Statut = 'réservé'
            GROUP BY 
                l.ISBN, l.Titre, l.Auteur, l.Genre, l.Exemplaires
        `;

        connection.query(query, [idUtilisateur], function (err, rows) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    "Error": true,
                    "Message": "Erreur lors de la requête MySQL"
                });
            }

            res.json({
                "Error": false,
                "Message": "Succès",
                "LivresReserves": rows
            });
        });

    } catch (error) {
        res.status(500).json({ "Error": true, "Message": error.message });
    }
};

module.exports = getReservedBooksByUser;
