const express = require('express');
const fs = require('fs');
const router = express.Router();

const PRODUCTS_FILE = './data/products.json';

function readProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, '[]');
  }
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// 🔍 GET tutti i prodotti
router.get('/', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// 🔍 GET singolo prodotto
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const products = readProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Prodotto non trovato' });
  }

  res.json(product);
});

// ➕ POST nuovo prodotto
router.post('/', (req, res) => {
  const { nome, produttore, foto, prezzo, descrizione, categoria } = req.body;
  const products = readProducts();

  const nuovoProdotto = {
    id: Math.floor(Math.random() * 1000000), 
    nome,
    produttore,
    foto,
    prezzo,
    descrizione,
    categoria
  };

  products.push(nuovoProdotto);
  writeProducts(products);
  res.status(201).json({ message: 'Prodotto creato', prodotto: nuovoProdotto });
});

// ✏️ PUT modifica prodotto
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, produttore, foto, prezzo, descrizione, categoria } = req.body;
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Prodotto non trovato' });
  }

  products[index] = {
    ...products[index],
    nome,
    produttore,
    foto,
    prezzo,
    descrizione,
    categoria
  };

  writeProducts(products);
  res.json({ message: 'Prodotto aggiornato', prodotto: products[index] });
});

// 🗑 DELETE prodotto
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let products = readProducts();
  const prodotto = products.find(p => p.id === id);

  if (!prodotto) {
    return res.status(404).json({ message: 'Prodotto non trovato' });
  }

  products = products.filter(p => p.id !== id);
  writeProducts(products);

  res.json({ message: 'Prodotto eliminato' });
});

module.exports = router;
