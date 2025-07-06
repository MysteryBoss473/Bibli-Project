var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken');
var config = require('../config');
var connection = require("../database");

// Fonction de recherche d'emprunts réservés avec filtre dynamique
const searchReservedEmprunts = async (req, res) => {
    try {
        const { recherche } = req.query;

        if (!recherche || recherche.trim() === "") {
            return res.status(400).json({
                "Error": true,
                "Message": "Paramètre 'recherche' requis"
            });
        }

        // Requête avec jointures et filtre sur nom, prénom ou titre
        let query = `
            SELECT 
                e.idEmprunt, 
                u.Nom, 
                u.Prenoms, 
                l.Titre
            FROM 
                emprunt e
            JOIN utilisateur u ON e.idUtilisateur = u.idUtilisateur
            JOIN livre l ON e.ISBN = l.ISBN
            WHERE 
                e.Statut = 'réservé'
                AND (
                    u.Nom LIKE ? OR 
                    u.Prenoms LIKE ? OR 
                    l.Titre LIKE ?
                )
        `;

        const searchTerm = `%${recherche}%`;
        const params = [searchTerm, searchTerm, searchTerm];

        connection.query(query, params, function (err, rows) {
            if (err) {
                console.error(err);
                return res.status(500).json({ "Error": true, "Message": "Erreur lors de la requête MySQL" });
            }

            res.json({
                "Error": false,
                "Message": "Résultats trouvés",
                "EmpruntsReserves": rows
            });
        });

    } catch (error) {
        res.status(500).json({ "Error": true, "Message": error.message });
    }
};

module.exports = searchReservedEmprunts;
