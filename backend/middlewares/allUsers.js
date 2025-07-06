var mysql = require("mysql");
var connection = require("../database");

const getTousLesEtudiantsSansMotDePasseNiRole = async (req, res) => {
    try {
        const query = `
            SELECT idUtilisateur, Nom, Prenoms, Email
            FROM utilisateur
            WHERE Role = 'etudiant'
        `;

        connection.query(query, function (err, rows) {
            if (err) {
                res.status(500).json({ Error: true, Message: "Erreur MySQL", Details: err });
            } else if (rows.length === 0) {
                res.status(404).json({ Error: true, Message: "Aucun étudiant trouvé" });
            } else {
                res.status(200).json({ Error: false, Message: "Étudiants trouvés", Utilisateurs: rows });
            }
        });

    } catch (error) {
        res.status(500).json({ Error: true, Message: error.message });
    }
};

module.exports = getTousLesEtudiantsSansMotDePasseNiRole;
