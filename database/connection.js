var mysql = require('mysql2');

var database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'WOAHpassword69!',
    database: 'social_circles'
  });
  
  database.connect((err => {
    if (err) throw err;
    console.log('MySQL Connected');
  }));

  module.exports = database;