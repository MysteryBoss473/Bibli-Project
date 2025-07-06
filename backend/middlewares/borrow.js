var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken');
var config = require('../config');
var connection = require("../database");

// Fonction pour mettre à jour le statut d'un emprunt à 'emprunté'
const markEmpruntAsBorrowed = async (req, res) => {
    try {
        const { idEmprunt } = req.body;

        if (!idEmprunt) {
            return res.status(400).json({
                "Error": true,
                "Message": "idEmprunt requis"
            });
        }

        // Vérifie si l'emprunt existe et récupère son statut actuel
        const selectQuery = "SELECT Statut FROM emprunt WHERE idEmprunt = ?";
        connection.query(selectQuery, [idEmprunt], function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({ "Error": true, "Message": "Erreur lors de la récupération de l'emprunt" });
            }

            if (results.length === 0) {
                return res.status(404).json({ "Error": true, "Message": "Emprunt introuvable" });
            }

            const { Statut } = results[0];

            if (Statut === "emprunté") {
                return res.status(400).json({ "Error": true, "Message": "L'emprunt est déjà marqué comme emprunté" });
            }

            if (Statut === "annulé") {
                return res.status(400).json({ "Error": true, "Message": "Impossible de marquer comme emprunté un emprunt annulé" });
            }

            // Mise à jour du statut à 'emprunté'
            const updateQuery = "UPDATE emprunt SET Statut = 'emprunté' WHERE idEmprunt = ?";
            connection.query(updateQuery, [idEmprunt], function (err2) {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ "Error": true, "Message": "Erreur lors de la mise à jour du statut" });
                }

                res.json({
                    "Error": false,
                    "Message": "Statut de l'emprunt mis à jour à 'emprunté'"
                });
            });
        });

    } catch (error) {
        res.status(500).json({ "Error": true, "Message": error.message });
    }
};

module.exports = markEmpruntAsBorrowed;
