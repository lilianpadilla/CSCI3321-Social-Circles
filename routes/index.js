var express = require('express');
var mysql = require('mysql2');
var router = express.Router();
const db = require("../database/connection");

// Login page route
router.get("/", (req, res) => {
  console.log("Login page activated");
  res.render('index', { title: 'Login', error: null });
});

// Login POST handler
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (username === "admin" && password === "password") { 
    res.redirect("/home");
  } else {
    res.render("index", { title: "Login", error: "Invalid credentials" });
  }
});

// Homepage route (defined outside the POST handler)
router.get("/home", (req, res) => {
  console.log("Homepage route activated");
  res.render('home', { title: 'Homepage' });
});


router.get("/userpage", (req, res) => {
  console.log("User profile page activated");

  const user = {
    username: "admin", 
    email: "admin@example.com", 
    joinDate: "January 1, 2023"
  };

  res.render('userpage', {
    title: 'User Profile',
    username: user.username,
    email: user.email,
    joinDate: user.joinDate
  });
});

router.get("/characters", (req, res) => {
  console.log("all characters route");
  let sql = `SELECT * FROM characters;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.render('characters', { title: 'Characters', characters: result });
  });
});

router.get('/characters/:charID', (req, res) => {
  const characterID = req.params.charID;
  console.log("characters route");
  let sql = `SELECT * FROM characters WHERE ID = ?;`;
  db.query(sql, [characterID], (err, result) => {
    if (err) throw err;
    var row = result[0];
    res.render('character_page', { title: 'Character Page', character: row });
  });
});

module.exports = router;
