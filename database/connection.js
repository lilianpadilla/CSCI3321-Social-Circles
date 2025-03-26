var mysql = require('mysql2');
require('dotenv').config();

var database = mysql.createConnection({
    host: process.env.DATABASE_host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  });
  
  database.connect((err => {
    if (err) throw err;
    console.log('MySQL Connected');
  }));

  module.exports = database;