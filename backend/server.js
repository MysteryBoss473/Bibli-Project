var express = require("express");
var mysql   = require("mysql");
var cors = require('cors');
var bodyParser  = require("body-parser");



var verifyToken = require('./middlewares/verifyToken');
var inscription = require('./middlewares/inscription');
var authentification = require('./middlewares/authentification');

var allBook = require('./middlewares/allBook');
var oneBook = require('./middlewares/oneBook');
var addBook = require('./middlewares/addBook');
var deleteBook = require('./middlewares/deleteBook');
var updateBook = require('./middlewares/updateBook');
var searchBook = require('./middlewares/searchBook');

var allUsers = require('./middlewares/allUsers');
var deleteUser = require('./middlewares/deleteUser');
var updateUser = require('./middlewares/updateUser');
var searchUser = require('./middlewares/searchUser');

var addLoan = require('./middlewares/addLoan');
var borrow = require('./middlewares/borrow');
var cancelLoan = require('./middlewares/cancelLoan');
var giveBack = require('./middlewares/giveBack');
var historyPersonal = require('./middlewares/historyPersonal');
var loanPersonal = require('./middlewares/loanPersonal');
var loans = require('./middlewares/loans');
var reservations = require('./middlewares/reservations');
var searchReservation = require('./middlewares/searchReservation');
var searchLoans = require('./middlewares/searchLoans');
var searchLoanPersonal = require('./middlewares/searchLoanPersonal');
var searchHistoryPersonal = require('./middlewares/searchHistoryPersonal');

var note = require('./middlewares/note');

const port = process.env.PORT || 4400;   

  
////  Routes  principales  

var app  = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signup', inscription);
app.post('/userlogin', authentification);


////  Sous-Routes avec Token

var apiRoutes = express.Router();
apiRoutes.use(bodyParser.urlencoded({ extended: true }));
apiRoutes.use(bodyParser.json());

apiRoutes.use(verifyToken);
const isAdmin = require('./middlewares/isAdmin');

apiRoutes.get('/livre', allBook);
apiRoutes.get('/livre/:isbn', oneBook);
apiRoutes.post('/livre', isAdmin, addBook);
apiRoutes.delete('/livre/:id', isAdmin, deleteBook);
apiRoutes.put('/livre/:id', isAdmin, updateBook);
apiRoutes.get('/livre/recherche', searchBook);

apiRoutes.get('/utilisateur', isAdmin, allUsers);
apiRoutes.delete('/utilisateur/:id', isAdmin, deleteUser);
apiRoutes.put('/utilisateur/:id', isAdmin, updateUser);
apiRoutes.get('/utilisateur/recherche', isAdmin, searchUser);

apiRoutes.post('/emprunt', addLoan);
apiRoutes.put('/emprunt/emprunter', isAdmin, borrow);
apiRoutes.put('/emprunt/annuler', cancelLoan);
apiRoutes.put('/emprunt/rendre', isAdmin, giveBack);
apiRoutes.get('/emprunt/historique/:id', historyPersonal);
apiRoutes.get('/emprunt/reservations/:id', loanPersonal);
apiRoutes.get('/emprunt/adminemprunts', isAdmin, loans);
apiRoutes.get('/emprunt/adminreservations', isAdmin, reservations);
apiRoutes.get('/emprunt/adminreservations/recherche',isAdmin, searchReservation);
apiRoutes.get('/emprunt/adminemprunts/recherche', isAdmin, searchLoans);
apiRoutes.get('/emprunt/reservations/recherche', searchLoanPersonal);
apiRoutes.get('/emprunt/historique/recherche', searchHistoryPersonal);

apiRoutes.post('/note', note);

app.use('/api', apiRoutes);


app.listen( port , () => {
    console.log('Démarrage et écoute sur le port  ' +port);
});
