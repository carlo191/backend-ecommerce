const express = require("express");
const fs = require("fs");
const router = express.Router();

const USERS_FILE = "./data/users.json";

// Legge utenti dal file
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

// Scrive utenti nel file
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { nome, cognome, email, password, dataNascita } = req.body;
  const users = readUsers();

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email già registrata" });
  }

  const newUser = {
    id: Math.floor(Math.random() * 1000000) + 1,
    nome,
    cognome,
    email,
    password,
    dataNascita,
    ruolo: "user",
  };

  users.push(newUser);
  writeUsers(users);

  res
    .status(201)
    .json({ message: "Utente registrato con successo", user: newUser });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Credenziali non valide" });
  }

  res.json({ message: "Login riuscito", user });
});

module.exports = router;
