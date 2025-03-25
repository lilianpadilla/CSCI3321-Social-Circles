var express = require('express');
var mysql = require('mysql2');
var app = express();
var router = express.Router();
const db = require("../database/connection");

router.get("/",(req,res) => {
  console.log("home page activated");
  res.render('index',{title:'Homepage'});
});

router.get("/characters",(req,res) => {
  console.log("all characters route");
  let sql = `SELECT * FROM characters;`;
  db.query(sql,(err,result) => {
      if(err) throw err;
      console.log(result);
      res.render('characters',{title:'Characters',characters:result});
  })
  
});

router.get('/characters/:charID', (req, res) => {
  const characterID = req.params.charID;
  console.log("characters route");
  let sql = `SELECT * FROM characters WHERE ID = ?;`;
  db.query(sql,[characterID],(err,result) =>{
    if(err) throw err;
    var row = result[0];
    res.render('character_page',{title:'Character Page',character:row});
  });
});

module.exports = router;
