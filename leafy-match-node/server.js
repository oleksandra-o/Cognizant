const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

let cartItems = []; // In-memory cart

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Chicago1$', // Update your MySQL password
  database: 'leafy_match',
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Database connection check
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Routes

// Home Page - Fetch products
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

// About Page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Contact Page
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

// Cart Page
app.get('/cart', (req, res) => {
  if (cartItems.length === 0) {
    return res.redirect('/#products'); // Redirect to products if cart is empty
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.09; // 9% tax
  const shippingCost = cartItems.length > 0 ? 9.99 : 0;
  const total = subtotal + tax + shippingCost;

  res.render('cart', {
    title: 'Your Cart',
    cartItems,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shippingCost: shippingCost.toFixed(2),
    total: total.toFixed(2),
  });
});

// Add to Cart API
app.post('/cart/add', (req, res) => {
  const { id, name, price } = req.body;

  if (!id || !name || !price) {
    return res.status(400).json({ success: false, message: 'Invalid product data.' });
  }

  cartItems.push({ id, name, price: parseFloat(price) });
  res.json({ success: true, message: 'Product added to cart.', cartItems });
});

// Clear Cart API (optional for testing)
app.post('/cart/clear', (req, res) => {
  cartItems = [];
  res.json({ success: true, message: 'Cart cleared.', cartItems });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});