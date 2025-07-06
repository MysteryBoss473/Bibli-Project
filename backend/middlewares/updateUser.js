var mysql = require("mysql");
var connection = require("../database");

const modifierUtilisateur = async (req, res) => {
    try {
        const { idUtilisateur } = req.params;
        const { Nom, Prenoms, Email, Role } = req.body;

        if (!idUtilisateur || !Nom || !Prenoms || !Email || !Role) {
            return res.status(400).json({ 
                Error: true, 
                Message: "Champs manquants. Requiert idUtilisateur, Nom, Prenoms, Email, Role" 
            });
        }

        const query = `
            UPDATE utilisateur
            SET Nom = ?, Prenoms = ?, Email = ?, Role = ?
            WHERE idUtilisateur = ?
        `;

        const values = [Nom, Prenoms, Email, Role, idUtilisateur];

        connection.query(query, values, function (err, result) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur MySQL", Details: err });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ Error: true, Message: "Aucun utilisateur trouvé avec cet ID" });
            } else {
                res.status(200).json({ Error: false, Message: "Utilisateur modifié avec succès" });
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = modifierUtilisateur;
