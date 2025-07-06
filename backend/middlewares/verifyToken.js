const jwt = require('jsonwebtoken');
const config = require('../config');
const mysql = require('mysql2'); // même version que dans ton login
const db = require('../database');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = req?.body?.token || req?.query?.token || req?.headers['token'] || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé : token manquant' });
    }

    // Vérifier le token
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        console.error('Erreur de vérification du token :', err);
        return res.status(401).json({ message: 'Token invalide ou expiré' });
      }

      const userId = decoded.idUtilisateur;

      if (!userId) {
        return res.status(400).json({ message: "Token invalide : idUtilisateur manquant" });
      }

      // Vérifier que l'utilisateur existe encore et récupérer son rôle
      const query = 'SELECT idUtilisateur, Email, Role FROM utilisateur WHERE idUtilisateur = ?';
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Erreur base de données :', err);
          return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Ajouter les infos utilisateur à la requête pour les routes suivantes
        req.currUser = results[0]; // { idUtilisateur, Email, Role }
        next();
      });
    });
  } catch (error) {
    console.error("Erreur dans verifyToken:", error);
    res.status(500).json({ Error: true, Message: error.message || error });
  }
};

module.exports = verifyToken;
