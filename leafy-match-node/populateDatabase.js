const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Chicago1$', 
  database: 'leafy_match',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Read JSON data from the `data` folder
const filePath = path.join(__dirname, 'data', 'plants.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Insert query
const query = `
  INSERT INTO Products (ID, Name, Description, Cost, Image, Light, Watering, Humidity, Fertilizer)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

data.forEach((plant) => {
  db.query(
    query,
    [
      plant.id,
      plant.name,
      plant.description,
      plant.price,
      plant.image,
      plant.light,
      plant.watering,
      plant.humidity,
      plant.fertilizer,
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
      } else {
        console.log(`Inserted: ${plant.name}`);
      }
    }
  );
});

// Close the database connection
db.end((err) => {
  if (err) {
    console.error('Error closing the database connection:', err);
    return;
  }
  console.log('Database connection closed.');
});