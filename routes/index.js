var express = require('express');
var mysql = require('mysql2');
var router = express.Router();
const db = require("../database/connection");
var session = require('express-session');
const hash = require('../js/cyber.js'); //will add password hash & checks when sign up page exists
const code = require('../js/code.js');

//function so people cant just type endpoints for user-only pages, e.g. user profile
function isAuthenticated (req, res, next) {
  if (req.session.username) next()
  else next('route')
}

// Handle user registration
router.post('/register', (req, res) => {
    console.log("Create User page activated")
    const {username, password} = req.body;
    console.log(req.body);
    let sql = `SELECT * FROM users WHERE Username = ?;`;
    db.query(sql,[username], (err, result) => {
      if (err){ 
        throw err;
      } else if (result.length === 0){ //Username not yet taken case
        let sql = `INSERT INTO users (Username, Password) VALUES (?,?)`;
        db.query(sql,[username,password], (err,result) => {
            if(err) throw err;
            res.redirect('/');
        });
      }else{ //username taken case
        res.render("createuser", {error: "Username Taken" });
      }
    });
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
  let sql = `SELECT ID, Username, Password, IsAdmin, HasRedo, DATE_FORMAT(JoinDate, "%M %d %Y") AS JoinDate FROM users WHERE Username = ?;`;
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
        req.session.joinDate = result[0].JoinDate; //Store joindate
        res.redirect("/home");
      } else { //Incorrect password case
        res.render("index", { title: "Login", error: "Invalid credentials" });
      }
    }
    
  });
});

router.get("/home", isAuthenticated, function (req, res) {
  console.log("Homepage route activated");
  let sql = 'SELECT * FROM characters;';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    var charr = [];
    result.forEach((char) =>{
      charr.push(new code.Character(char.Name, char.Compliment,char.Help,char.Invite));
    });
    var game = code.newGame(charr);
    //console.log(game)
      // If not logged in, show message instead of username
    const username = req.session.username || null;
    let sql2 = 'SELECT User_ID, Username, sum(Score) as "Score" FROM leaderboard JOIN users ON users.ID = leaderboard.User_ID WHERE DatePlayed BETWEEN date_sub(NOW(), Interval 1 week) and NOW() GROUP BY User_ID ORDER BY score DESC;'
    db.query(sql2, (err2, result2) =>{
      if (err2) throw err2;
      console.log(result2);
      res.render('home', {
        title: 'Homepage',
        user: username,
        circles: game,
        message: `Welcome back, ${username}!`,
        leaderboard: result2
      });
    });
  });
});

router.get("/home", function (req, res) {
  console.log("Homepage route activated");
  let sql = 'SELECT * FROM characters;';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    var charr = [];
    result.forEach((char) =>{
      charr.push(new code.Character(char.Name, char.Compliment,char.Help,char.Invite));
    });
    var game = code.newGame(charr);
    //console.log(game)
      // If not logged in, show message instead of username
    const username = req.session.username || null;
    let sql2 = 'SELECT User_ID, Username, sum(Score) as "Score" FROM leaderboard JOIN users ON users.ID = leaderboard.User_ID WHERE DatePlayed BETWEEN date_sub(NOW(), Interval 1 week) and NOW() GROUP BY User_ID ORDER BY score DESC;'
    db.query(sql2, (err2, result2) =>{
      if (err2) throw err2;
      console.log(result2);
      res.render('home', {
        title: 'Homepage',
        user: username,
        circles: game,
        message: `Enjoy Gaming!`,
        leaderboard: result2
      });
    });
  });
});

//needs to send info to database
router.post("/play", isAuthenticated, function (req,res){
  console.log("scoring route activated");
  console.log(req.body);
  const {circleIndex, game, action} = req.body;
  console.log(game);
  const gamer = code.Game.fromString(game);
  const scorey = gamer.score(parseInt(circleIndex), action);
  console.log(scorey);
  let sql = `INSERT INTO leaderboard (User_ID, Score) VALUES (?,?)`;
  db.query(sql,[req.session.userId,scorey], (err,result) => {
      if(err) throw err;
   });
  let sql2 = 'SELECT User_ID, Username, sum(Score) as "Score" FROM leaderboard JOIN users ON users.ID = leaderboard.User_ID WHERE DatePlayed BETWEEN date_sub(NOW(), Interval 1 week) and NOW() GROUP BY User_ID ORDER BY score DESC;'
  db.query(sql2, (err2, result2) =>{
    if (err2) throw err2;
    console.log(result2);
    res.render('home', {
      title: 'Homepage',
      user: req.session.username,
      circles: gamer,
      message: `Score: ${scorey}!`,
      leaderboard: result2
    });
  });
});

router.post("/play", function (req,res){
  console.log("scoring route activated");
  console.log(req.body);
  const {circleIndex, game, action} = req.body;
  console.log(game);
  const gamer = code.Game.fromString(game);
  const scorey = gamer.score(parseInt(circleIndex), action);
  console.log(scorey);
  let sql2 = 'SELECT User_ID, Username, sum(Score) as "Score" FROM leaderboard JOIN users ON users.ID = leaderboard.User_ID WHERE DatePlayed BETWEEN date_sub(NOW(), Interval 1 week) and NOW() GROUP BY User_ID ORDER BY score DESC;'
  db.query(sql2, (err2, result2) =>{
    if (err2) throw err2;
    console.log(result2);
    res.render('home', {
      title: 'Homepage',
      user: req.session.username,
      circles: gamer,
      message: `Score: ${scorey}!`,
      leaderboard: result2
    });
  });
});

// Userpage if logged in
router.get("/userpage", isAuthenticated, (req, res) => {
  console.log("User profile page attempt, redirected");
  let sql = 'SELECT User_ID, Score, DATE_FORMAT(DatePlayed, "%M %d %Y") as DatePlayed FROM leaderboard WHERE User_ID = ? ORDER BY DatePlayed DESC;';
  db.query(sql, [req.session.userId], (err, result) => {
    if (err) throw err;
    res.render('userpage', {
      title: 'User Profile',
      username: req.session.username,
      joinDate: req.session.joinDate,
      scores: result
    });
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
