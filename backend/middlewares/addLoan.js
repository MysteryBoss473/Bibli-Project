var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken');
var config = require('../config');
var connection = require("../database");

// Fonction pour créer un emprunt et diminuer le nombre d'exemplaires
const createEmprunt = async (req, res) => {
    try {
        const { Statut, DateEmprunt, LimiteRetour, ISBN, idUtilisateur } = req.body;

        // Vérification des champs requis
        if (!Statut || !DateEmprunt || !LimiteRetour || !ISBN || !idUtilisateur) {
            return res.status(400).json({
                "Error": true,
                "Message": "Champs requis manquants"
            });
        }

        // Vérifier s'il reste des exemplaires disponibles
        let checkQuery = "SELECT Exemplaires FROM livre WHERE ISBN = ?";
        connection.query(checkQuery, [ISBN], function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({ "Error": true, "Message": "Erreur lors de la vérification du stock de livres" });
            }

            if (results.length === 0) {
                return res.status(404).json({ "Error": true, "Message": "Livre non trouvé" });
            }

            const exemplairesDispo = results[0].Exemplaires;

            if (exemplairesDispo <= 0) {
                return res.status(400).json({ "Error": true, "Message": "Aucun exemplaire disponible pour ce livre" });
            }

            // Créer l'emprunt
            let insertQuery = "INSERT INTO emprunt (Statut, DateEmprunt, LimiteRetour, ISBN, idUtilisateur) VALUES (?, ?, ?, ?, ?)";
            const insertValues = [Statut, DateEmprunt, LimiteRetour, ISBN, idUtilisateur];

            connection.query(insertQuery, insertValues, function (err, result) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ "Error": true, "Message": "Erreur lors de la création de l'emprunt" });
                }

                // Diminuer le nombre d'exemplaires
                let updateQuery = "UPDATE livre SET Exemplaires = Exemplaires - 1 WHERE ISBN = ?";
                connection.query(updateQuery, [ISBN], function (err2, result2) {
                    if (err2) {
                        console.error(err2);
                        return res.status(500).json({ "Error": true, "Message": "Emprunt créé, mais erreur lors de la mise à jour des exemplaires" });
                    }

                    // Réponse finale
                    res.json({
                        "Error": false,
                        "Message": "Emprunt créé et exemplaires mis à jour avec succès",
                        "EmpruntID": result.insertId
                    });
                });
            });
        });

    } catch (error) {
        res.status(500).json({ "Error": true, "Message": error.message });
    }
};

module.exports = createEmprunt;
