var mysql = require("mysql");
var express = require("express");
var jwt = require("jsonwebtoken");
var config = require("../config");
var connection = require("../database");

// Ajouter une note à un livre
const addNote = async (req, res) => {
    try {
        const { Note, ISBN, idUtilisateur } = req.body;

        if (!Note || !ISBN || !idUtilisateur) {
            return res.status(400).json({
                Error: true,
                Message: "Champs 'Note', 'ISBN' et 'idUtilisateur' requis"
            });
        }

        // Vérifier que la note est entre 0 et 5
        if (Note < 0 || Note > 5) {
            return res.status(400).json({
                Error: true,
                Message: "La note doit être comprise entre 0 et 5"
            });
        }

        // Vérifier si une note existe déjà pour cet utilisateur et ce livre
        const checkQuery = `
            SELECT * FROM notation 
            WHERE ISBN = ? AND idUtilisateur = ?
        `;
        connection.query(checkQuery, [ISBN, idUtilisateur], function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({ Error: true, Message: "Erreur lors de la vérification de la note" });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    Error: true,
                    Message: "Une note existe déjà pour ce livre et cet utilisateur"
                });
            }

            // Insertion de la note
            const insertQuery = `
                INSERT INTO notation (Note, ISBN, idUtilisateur)
                VALUES (?, ?, ?)
            `;
            connection.query(insertQuery, [Note, ISBN, idUtilisateur], function (err2, result) {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ Error: true, Message: "Erreur lors de l'insertion de la note" });
                }

                res.json({
                    Error: false,
                    Message: "Note ajoutée avec succès",
                    NoteID: result.insertId
                });
            });
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = addNote;
