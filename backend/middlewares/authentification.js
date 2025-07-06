const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const connection = require("../database");

const userLoginCheck = async (req, res, next) => {
  try {
    const post = {
      password: req.body.password,
      email: req.body.email
    };

    // Requête pour récupérer l'utilisateur correspondant à l'email
    let query = "SELECT * FROM ?? WHERE ?? = ?";
    let table = ["utilisateur", "Email", post.email];
    query = mysql.format(query, table);

    connection.query(query, async (err, rows) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).json({ Error: true, Message: "Erreur serveur" });
      }

      if (rows.length === 0) {
        return res.status(401).json({ Error: true, Message: "Email ou mot de passe incorrect" });
      }

      const user = rows[0];
      const hashStored = user.MotDePasse;

      const isMatch = await bcrypt.compare(post.password, hashStored);
      if (!isMatch) {
        return res.status(401).json({ Error: true, Message: "Email ou mot de passe incorrect" });
      }

      // Création du token JWT avec l'id et l'email uniquement
      const payload = {
        idUtilisateur: user.idUtilisateur,
        Email: user.Email,
        Role: user.Role
      };

      const token = jwt.sign(payload, config.secret, { expiresIn: '2h' });

      // Préparer les données à insérer dans la table access_token
      const data = {
        idUtilisateur: user.idUtilisateur,
        access_token: token
      };

      let insertQuery = "INSERT INTO ?? SET ?";
      let insertValues = ["access_token", data];
      insertQuery = mysql.format(insertQuery, insertValues);

      connection.query(insertQuery, (err, result) => {
        if (err) {
          console.error("Erreur lors de l'enregistrement du token :", err);
          return res.status(500).json({ Error: true, Message: "Erreur lors de la génération du token" });
        }

        return res.json({
          success: true,
          currUser: user.idUtilisateur,
          email: user.Email,
          role: user.Role,
          message: "Connexion réussie",
          token: token
        });
      });
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ Error: true, Message: error.message });
  }
};

module.exports = userLoginCheck;
