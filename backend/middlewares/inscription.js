const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const connection = require("../database");

const addNewUser = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const post = {
      idUtilisateur: req.body.idUtilisateur,
      Nom: req.body.nom,
      Prenoms: req.body.prenom,
      Email: req.body.email,
      MotDePasse: hashedPassword,
      Role: req.body.role || 'utilisateur'
    };

    console.log("Données reçues :", post);

    let checkQuery = "SELECT Email FROM ?? WHERE ?? = ?";
    let checkValues = ["utilisateur", "Email", post.Email];
    checkQuery = mysql.format(checkQuery, checkValues);

    connection.query(checkQuery, (err, rows) => {
      if (err) {
        console.error("Erreur MySQL lors de la vérification :", err);
        return res.json({ Error: true, Message: "Erreur MySQL lors de la vérification" });
      }

      if (rows.length > 0) {
        return res.json({ Error: false, Message: "Email déjà enregistré" });
      }

      let insertQuery = "INSERT INTO ?? SET ?";
      let insertValues = ["utilisateur", post];
      insertQuery = mysql.format(insertQuery, insertValues);

      console.log("Requête SQL d'insertion :", insertQuery);

      connection.query(insertQuery, (err, result) => {
        if (err) {
          console.error("Erreur MySQL lors de l'insertion :", err);
          return res.json({ Error: true, Message: "Erreur MySQL lors de l'insertion" });
        }

        return res.json({ Error: false, Message: "Utilisateur ajouté avec succès" });
      });
    });

  } catch (error) {
    console.error("Erreur catch :", error);
    return res.json({ Error: true, Message: error.message });
  }
};

module.exports = addNewUser;

