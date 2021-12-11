const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

const generateRandomString = function () {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};
//console.log(generateRandomString());

const user = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const getCookieUser = function (req) {
  const userId = req.cookies["user_id"];
  return user[userId];
}

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: getCookieUser(req) };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  console.log(req.body); // logs the POST req body to console
  //res.send("OK"); // responds with 'OK'
  res.redirect(`/urls/${shortURL}`); //should redirect to the random string generated
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: getCookieUser(req) };
  res.render("urls_new", templateVars);
});

// LOGIN
app.post("/login", (req, res) => {
  const userName = req.body.username;
  const existUser = Object.values(user).find(usr => usr.email === userName);
  if (existUser) {
    res.cookie('user_id', existUser.id);
    res.redirect('/urls');
  } else {
    res.send('User not exist');
  }
});

app.get("/login", (req, res) => {
  const templateVars = { user: getCookieUser(req) };
  res.render("login", templateVars);
});

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect('/urls');
});

//Register
app.get("/register", (req, res) => {
  const templateVars = { user: getCookieUser(req) };
  res.render("register", templateVars);
});

// Get the info from the register form
app.post('/register', (req, res) => {
  // extract the info from the form
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    return res.status(400).send("Email or password should not be empty");
  }

  const userId = generateRandomString();

  const newUserObj = {
    id: userId,
    email,
    password,
  };

  // Add the user Object into the usersDb
  user[userId] = newUserObj;

  res.cookie('user_id', userId);

  res.redirect("/urls");
});



//-------------------
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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

