
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({

    host: 'localhost',   
    user: 'root',
    password: 'RH01.11.2005',
    database: 'bibli-project',

});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
  
