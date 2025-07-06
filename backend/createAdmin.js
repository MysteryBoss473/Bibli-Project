const addNewUser = require('./middlewares/inscription');

const req = {
  body: {
    idUtilisateur: 0,
    nom: 'admin',
    prenom: 'administrateur',
    email: 'admin@example.com',
    password: 'MotDePasseSuperSecurisé',
    role: 'admin'
  }
};

// simule res sans rien afficher
const res = {
  json: (data) => {
    if (data.Error) {
      process.exit(1); // erreur d'insertion
    } else {
      process.exit(0); // succès
    }
  }
};

const next = () => {};

addNewUser(req, res, next);
