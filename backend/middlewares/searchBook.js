var mysql = require("mysql");
var connection = require("../database");

const rechercherLivres = async (req, res) => {
    try {
        const recherche = req.query.query;

        if (!recherche) {
            return res.status(400).json({ Error: true, Message: "Paramètre de recherche manquant (q)" });
        }

        const searchPattern = `%${recherche}%`;

        const query = `
            SELECT 
                l.ISBN,
                l.Titre,
                l.Auteur,
                l.Genre,
                (l.Exemplaires > 0) AS Disponible,
                ROUND(AVG(n.Note), 1) AS Note
            FROM 
                livre l
            LEFT JOIN 
                notation n ON l.ISBN = n.ISBN
            WHERE 
                l.Titre LIKE ? OR
                l.Auteur LIKE ? OR
                l.Genre LIKE ?
            GROUP BY 
                l.ISBN, l.Titre, l.Auteur, l.Genre, l.Exemplaires
        `;

        const values = [searchPattern, searchPattern, searchPattern];

        connection.query(query, values, function (err, rows) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur MySQL", Details: err });
            } else {
                res.status(200).json({ Error: false, Message: "Résultats trouvés", Livres: rows });
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = rechercherLivres;
