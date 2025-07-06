var mysql = require("mysql");
var connection = require("../database");

const supprimerUtilisateur = async (req, res) => {
    try {
        const { idUtilisateur } = req.params;

        if (!idUtilisateur) {
            return res.status(400).json({ Error: true, Message: "idUtilisateur manquant" });
        }

        const query = `
            DELETE FROM utilisateur
            WHERE idUtilisateur = ?
        `;

        connection.query(query, [idUtilisateur], function (err, result) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur MySQL", Details: err });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ Error: true, Message: "Aucun utilisateur trouvé avec cet ID" });
            } else {
                res.status(200).json({ Error: false, Message: "Utilisateur supprimé avec succès" });
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = supprimerUtilisateur;
