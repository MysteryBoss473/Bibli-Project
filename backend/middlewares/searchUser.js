var mysql = require("mysql");
var connection = require("../database");

const rechercherUtilisateurs = async (req, res) => {
    try {
        const recherche = req.query.q;

        if (!recherche) {
            return res.status(400).json({ Error: true, Message: "Paramètre de recherche manquant (q)" });
        }

        const searchPattern = `%${recherche}%`;

        const query = `
            SELECT idUtilisateur, Nom, Prenoms, Email, Role
            FROM utilisateur
            WHERE 
                idUtilisateur LIKE ? OR
                Nom LIKE ? OR
                Prenoms LIKE ? OR
                Email LIKE ?
        `;

        const values = [searchPattern, searchPattern, searchPattern, searchPattern];

        connection.query(query, values, function (err, rows) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur MySQL", Details: err });
            } else {
                res.status(200).json({ Error: false, Message: "Résultats trouvés", Utilisateurs: rows });
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = rechercherUtilisateurs;
