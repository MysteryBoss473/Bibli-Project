var mysql = require("mysql");
var connection = require("../database");

const getLivresAvecInfos = async (req, res) => {
    try {
        // Requête pour récupérer les livres avec note moyenne et disponibilité
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
            GROUP BY 
                l.ISBN, l.Titre, l.Auteur, l.Genre, l.Exemplaires
        `;

        connection.query(query, function (err, rows) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur MySQL", Details: err });
            } else {
                res.status(200).json({ Error: false, Message: "Succès", Livres: rows });
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = getLivresAvecInfos;
