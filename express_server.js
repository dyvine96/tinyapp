const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};
//console.log(generateRandomString());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  console.log(req.cookies.username);
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase [shortURL] = longURL;
  console.log(req.body); // logs the POST req body to console
  //res.send("OK"); // responds with 'OK'
  res.redirect(`/urls/${shortURL}`); //should redirect to the random string generated
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
}); 

// LOGIN
app.post("/login", (req, res) => {
  const userName = req.body.username;
  //console.log(req.body.username);
  res.cookie('username', userName);
  res.redirect('/urls');
});

// Logout
app.get("/logout", (req, res) => {;
  //req.cookies["username"] = null
  //req.clearCookie(username);
  res.clearCookie("username")
  res.redirect('/urls');
});

//Register
app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  //const templateVars = {shortURL, longURL};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const sURL = req.params.shortURL
  console.log(sURL);
  //console.log(JSON.stringify(urlDatabase));
delete urlDatabase[sURL];
//console.log(JSON.stringify(urlDatabase));
res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const urlPage = req.params.shortURL
  res.redirect(urlPage);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

