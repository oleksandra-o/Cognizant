const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Chicago1$', // Update this to your MySQL password
  database: 'leafy_match',
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Session middleware
app.use(
  session({
    secret: 'leafy-match-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set true if using HTTPS
  })
);

// Database connection check
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Route: Home Page
app.get('/', (req, res) => {
  const query = 'SELECT * FROM Products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }
    res.render('home', { title: 'Leafy Match', products: results });
  });
});

// Route: Cart Page
app.get('/cart', (req, res) => {
  const cartItems = req.session.cart || [];
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.1; // Example: 10% tax
  const shippingCost = cartItems.length > 0 ? 10 : 0; // Flat $10 shipping
  const total = subtotal + tax + shippingCost;

  res.render('cart', {
    title: 'Your Cart',
    cartItems,
    subtotal,
    tax,
    shippingCost,
    total,
  });
});

// Route: Add to Cart
app.post('/cart/add', (req, res) => {
  const { id, name, price } = req.body;

  if (!id || !name || !price) {
    return res.status(400).json({ success: false, message: 'Invalid product details' });
  }

  if (!req.session.cart) {
    req.session.cart = [];
  }

  req.session.cart.push({ id, name, price });
  return res.json({ success: true });
});

// Route: About Page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Route: Contact Page
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});