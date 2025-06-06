const express = require('express');
const fs = require('fs');
const router = express.Router();

const USERS_FILE = './data/users.json';

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 🔍 GET /api/users/:id → Vedi profilo
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const users = readUsers();
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }

  res.json(user);
});

// ✏️ PUT /api/users/:id → Modifica profilo
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, cognome, email, password, dataNascita } = req.body;

  const users = readUsers();
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }

  users[index] = {
    ...users[index],
    nome,
    cognome,
    email,
    password,
    dataNascita
  };

  writeUsers(users);
  res.json({ message: 'Profilo aggiornato', user: users[index] });
});

// 🗑 DELETE /api/users/:id → Elimina utente
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let users = readUsers();
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }

  users = users.filter(u => u.id !== id);
  writeUsers(users);

  res.json({ message: 'Utente eliminato' });
});

module.exports = router;
