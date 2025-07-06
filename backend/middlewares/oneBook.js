var mysql = require("mysql");
var connection = require("../database");

const getLivreParISBN = async (req, res) => {
    try {
        const { ISBN } = req.params;

        if (!ISBN) {
            return res.status(400).json({ Error: true, Message: "ISBN manquant" });
        }

        const query = `
            SELECT 
                l.Titre,
                l.Auteur,
                l.Genre,
                l.ISBN,
                l.DatePublication,
                (l.Exemplaires > 0) AS Disponible,
                ROUND(AVG(n.Note), 1) AS Note
            FROM 
                livre l
            LEFT JOIN 
                notation n ON l.ISBN = n.ISBN
            WHERE 
                l.ISBN = ?
            GROUP BY 
                l.Titre, l.Auteur, l.Genre, l.ISBN, l.DatePublication, l.Exemplaires
        `;

        connection.query(query, [ISBN], function (err, rows) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur MySQL", Details: err });
            } else if (rows.length === 0) {
                res.status(404).json({ Error: true, Message: "Aucun livre trouvé avec cet ISBN" });
            } else {
                res.status(200).json({ Error: false, Message: "Livre trouvé", Livre: rows[0] });
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = getLivreParISBN;
