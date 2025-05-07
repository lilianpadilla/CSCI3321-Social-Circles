var mysql = require('mysql2');
require('dotenv').config();

var database = mysql.createConnection({
    host: process.env.AZURE_MYSQL_HOST,
    user: process.env.AZURE_MYSQL_USER,
    password: process.env.AZURE_MYSQL_PASSWORD,
    database: process.env.AZURE_MYSQL_DATABASE
  });

  // var database = mysql.createConnection({
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME
  // });

  
  database.connect((err => {
    if (err) throw err;
    console.log('MySQL Connected');
  }));

  module.exports = database;
