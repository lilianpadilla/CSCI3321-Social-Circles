var express = require('express');
var mysql = require('mysql2');
var router = express.Router();
const db = require("../database/connection");
var session = require('express-session');
const hash = require('../js/cyber.js'); //will add password hash & checks when sign up page exists

//function so people cant just type endpoints for user-only pages, e.g. user profile
function isAuthenticated (req, res, next) {
  if (req.session.username) next()
  else next('route')
}




// Handle user registration
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Add database logic here (SQL)
    
    console.log(`New user: ${username}, Email: ${email}`);

    res.redirect('/login'); // Redirect to login page after successful registration
});

module.exports = router;

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

router.get("/home", function (req, res) {
  console.log("Homepage route activated");

  const characters = [
      { name: "Sam", happiness: 3 },
      { name: "Alex", happiness: 4 },
      { name: "Jess", happiness: 2 },
      { name: "Lee", happiness: 5 },
      { name: "Taylor", happiness: 1 },
      { name: "Riley", happiness: 3 },
      { name: "Jordan", happiness: 4 },
      { name: "Casey", happiness: 2 },
      { name: "Morgan", happiness: 3 },
  ];

  const shuffled = characters.sort(() => Math.random() - 0.5);
  const circles = [
      shuffled.slice(0, 3),
      shuffled.slice(3, 6),
      shuffled.slice(6, 9)
  ];

  // If not logged in, show message instead of username
  const username = req.session.username || null;

  res.render('home', {
      title: 'Homepage',
      user: username,
      circles,
      message: `Welcome back, ${username}!`
  });
});



// Userpage if logged in
router.get("/userpage", isAuthenticated, (req, res) => {
  console.log("User profile page attempt, redirected");

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

// attempt to reach user page if not logged in, sends to log in screen
router.get("/userpage", (req, res) => {
  console.log("User profile page activated");
  res.render("index", { title: "Login", error: "Please log in to see user profile page." });
});

router.get("/characters", (req, res) => {
  console.log("all characters route");
  let sql = `SELECT * FROM characters;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.render('characters', { title: 'Characters', characters: result, user: req.session.username});
  });
});

router.get('/characters/:charID', (req, res) => {
  const characterID = req.params.charID;
  console.log("characters route");
  let sql = `SELECT * FROM characters WHERE ID = ?;`;
  db.query(sql, [characterID], (err, result) => {
    if (err) throw err;
    var row = result[0];
    res.render('character_page', { title: 'Character Page', character: row, user: req.session.username});
  });
});

module.exports = router;
