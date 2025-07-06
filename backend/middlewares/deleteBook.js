var mysql = require("mysql");
var express = require("express");
var connection = require("../database");

// Fonction pour supprimer un livre
const supprimerLivre = async (req, res) => {
    try {
        const { ISBN } = req.params;

        if (!ISBN) {
            return res.status(400).json({ Error: true, Message: "ISBN manquant" });
        }

        // Requête SQL pour supprimer le livre
        let query = "DELETE FROM ?? WHERE ISBN = ?";
        const table = ["livre"];
        const values = [table[0], ISBN];
        query = mysql.format(query, values);

        connection.query(query, function(err, result) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur lors de la suppression", Details: err });
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).json({ Error: true, Message: "Aucun livre trouvé avec cet ISBN" });
                } else {
                    res.status(200).json({ Error: false, Message: "Livre supprimé avec succès" });
                }
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = supprimerLivre;
