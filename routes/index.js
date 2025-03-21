var express = require('express');
var mysql = require('mysql2');
var app = express();
var router = express.Router();
const db = require("../database/connection");

router.get("/",(req,res) => {
  console.log("characters route");
  let sql = `SELECT * FROM characters;`;
  db.query(sql,(err,result) => {
      if(err) throw err;
      console.log(result);
      res.render('index',{title:'Characters',characters:result});
  })
  
});

module.exports = router;
