var express = require('express');
var mysql = require('mysql2');
var app = express();
var router = express.Router();
const db = require("../database/connection");

router.get("/",(req,res) => {
  console.log("all characters route");
  let sql = `SELECT * FROM characters;`;
  db.query(sql,(err,result) => {
      if(err) throw err;
      console.log(result);
      res.render('index',{title:'Characters',characters:result});
  })
  
});

router.get('/char_page/:charID', (req, res) => {
  const characterID = req.params.charID;
  console.log("char_page route");
  let sql = `SELECT * FROM characters WHERE ID = ?;`;
  db.query(sql,[characterID],(err,result) =>{
    if(err) throw err;
    var row = result[0];
    res.render('char_page',{title:'Character Page',character:row});
  });
});

module.exports = router;
