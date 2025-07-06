var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken');
var config = require('../config');
var connection = require("../database");

// Fonction pour récupérer les emprunts réservés
const getReservedEmprunts = async (req, res) => {
    try {
        // Requête SQL avec jointure entre Emprunt, Utilisateur et Livre
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
                e.Statut = ?
        `;

        const inserts = ["réservé"]; // Ou "réserve" selon la valeur exacte dans ta base
        query = mysql.format(query, inserts);

        connection.query(query, function (err, rows) {
            if (err) {
                console.error(err);
                res.status(500).json({ "Error": true, "Message": "Erreur lors de la requête MySQL" });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Succès",
                    "EmpruntsRéservés": rows
                });
            }
        });

    } catch (error) {
        res.status(500).json({ "Error": true, "Message": error.message });
    }
};

module.exports = getReservedEmprunts;
