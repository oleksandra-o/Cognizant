const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL root password
  database: 'leafy_match',
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Home Route
app.get('/', (req, res) => {
  res.render('home', { title: 'Welcome to Leafy Match' });
});

// Products Route
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM Products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }
    res.render('products', { title: 'Our Products', products: results });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});