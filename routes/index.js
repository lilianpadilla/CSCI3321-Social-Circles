var express = require('express');
var mysql = require('mysql2');
var router = express.Router();
const db = require("../database/connection");
var session = require('express-session');
const hash = require('../js/cyber.js'); //will add password hash & checks when sign up page exists

//function so people cant just type endpoints for user-only pages, e.g. user profile
function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else next('route')
}

// Login page route
router.get("/", (req, res) => {
  console.log("Login page activated");
  res.render('index', { title: 'Login', error: null });
});

// Login POST handler
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  let sql = `SELECT * FROM users WHERE Username = ?;`;
  db.query(sql,[username], (err, result) => {
    if (err){ 
      throw err;
    } else if (result.length === 0){ //Username not found case
      res.render("index", { title: "Login", error: "Invalid credentials" })
    }else{
      console.log(result);
      let dbpass = result[0].Password;
      //console.log(dbpass);
      console.log(password === dbpass);
      if (password === dbpass) { 
        req.session.userId = result[0].ID; // Store user ID in the session
        req.session.username = result[0].Username; // Store username
        res.redirect("/home");
      } else { //Incorrect password case
        res.render("index", { title: "Login", error: "Invalid credentials" });
      }
    }
    
  });
});

// Homepage route (defined outside the POST handler)
//isAuthenticated,
//, user: req.session.username
router.get("/home",  (req, res) => {
    console.log("Homepage route activated");
    res.render('home', { title: 'Homepage'});
});


router.get("/userpage", (req, res) => {
  console.log("User profile page activated");

  const user = {
    username: req.session.username, 
    email: "admin@example.com", 
    joinDate: "January 1, 2023"
  };

  res.render('userpage', {
    title: 'User Profile',
    username: req.session.username,
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
