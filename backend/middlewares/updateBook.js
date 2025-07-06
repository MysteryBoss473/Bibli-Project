var mysql = require("mysql");
var express = require("express");
var connection = require("../database");

// Fonction pour modifier un livre
const updateBook = async (req, res) => {
    try {
        const { ISBN, Titre, Auteur, Genre, DatePublication, Exemplaires, Image } = req.body;

        if (!ISBN) {
            return res.status(400).json({ "Error": true, "Message": "ISBN manquant." });
        }

        const updateQuery = `
            UPDATE livre 
            SET Titre = ?, Auteur = ?, Genre = ?, DatePublication = ?, Exemplaires = ?, Image = ?
            WHERE ISBN = ?
        `;

        const data = [Titre, Auteur, Genre, DatePublication, Exemplaires, Image, ISBN];

        const formattedQuery = mysql.format(updateQuery, data);

        connection.query(formattedQuery, function(err, result) {
            if (err) {
                res.json({ "Error": true, "Message": "Erreur lors de la modification du livre." });
            } else {
                res.json({ "Error": false, "Message": "Livre modifié avec succès." });
            }
        });

    } catch (error) {
        res.json({ "Error": true, "Message": error.toString() });
    }
};

module.exports = updateBook;
