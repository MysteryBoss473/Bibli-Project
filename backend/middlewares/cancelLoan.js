var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken');
var config = require('../config');
var connection = require("../database");

// Fonction pour annuler un emprunt et remettre l'exemplaire
const cancelEmprunt = async (req, res) => {
    try {
        const { idEmprunt } = req.body;

        if (!idEmprunt) {
            return res.status(400).json({
                "Error": true,
                "Message": "idEmprunt requis"
            });
        }

        // Récupérer l'ISBN de l'emprunt
        const selectQuery = "SELECT ISBN, Statut FROM emprunt WHERE idEmprunt = ?";
        connection.query(selectQuery, [idEmprunt], function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({ "Error": true, "Message": "Erreur lors de la récupération de l'emprunt" });
            }

            if (results.length === 0) {
                return res.status(404).json({ "Error": true, "Message": "Emprunt introuvable" });
            }

            const { ISBN, Statut } = results[0];

            if (Statut === "annulé") {
                return res.status(400).json({ "Error": true, "Message": "L'emprunt est déjà annulé" });
            }

            // Mettre à jour le statut à 'annulé'
            const updateEmpruntQuery = "UPDATE emprunt SET Statut = 'annulé' WHERE idEmprunt = ?";
            connection.query(updateEmpruntQuery, [idEmprunt], function (err2) {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ "Error": true, "Message": "Erreur lors de la mise à jour du statut de l'emprunt" });
                }

                // Augmenter le nombre d'exemplaires du livre
                const updateLivreQuery = "UPDATE livre SET Exemplaires = Exemplaires + 1 WHERE ISBN = ?";
                connection.query(updateLivreQuery, [ISBN], function (err3) {
                    if (err3) {
                        console.error(err3);
                        return res.status(500).json({ "Error": true, "Message": "Statut modifié, mais erreur lors de la mise à jour des exemplaires" });
                    }

                    res.json({
                        "Error": false,
                        "Message": "Emprunt annulé et exemplaire remis avec succès"
                    });
                });
            });
        });

    } catch (error) {
        res.status(500).json({ "Error": true, "Message": error.message });
    }
};

module.exports = cancelEmprunt;
