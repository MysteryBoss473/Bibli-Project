var mysql = require("mysql");
var express = require("express");
var connection = require("../database");

// Fonction pour ajouter un livre
const ajouterLivre = async (req, res) => {
    try {
        const { ISBN, Titre, Auteur, Genre, DatePublication, Exemplaires } = req.body;

        // Validation basique
        if (!ISBN || !Titre || !Auteur || !Genre || !DatePublication || !Exemplaires) {
            return res.status(400).json({ Error: true, Message: "Champs manquants" });
        }

        // Requête SQL d'insertion
        let query = "INSERT INTO ?? (ISBN, Titre, Auteur, Genre, DatePublication, Exemplaires) VALUES (?, ?, ?, ?, ?, ?)";
        const table = ["livre"];
        const values = [table[0], ISBN, Titre, Auteur, Genre, DatePublication, Exemplaires];
        query = mysql.format(query, values);

        // Exécution de la requête
        connection.query(query, function(err, result) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur lors de l'insertion dans MySQL", Details: err });
            } else {
                res.status(201).json({ Error: false, Message: "Livre ajouté avec succès", LivreID: result.insertId });
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = ajouterLivre;
