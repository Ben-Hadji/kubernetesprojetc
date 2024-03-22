const express = require('express');
const mysql = require('mysql2');

const app = express();

// Configure MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL.');
  
    // Create the database
    db.query('CREATE DATABASE IF NOT EXISTS database', (err, result) => {
      if (err) throw err;
      console.log('Database created.');
  
      // Now you can create a new connection with the database
      db.changeUser({database : 'database'}, function(err) {
        if (err) throw err;
      });
    });
  });

// Create 'eleves' table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS eleves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    age INT
  )
`;

db.query(createTableQuery, (err, result) => {
  if (err) throw err;
  console.log('Table \'eleves\' created.');

  // Insert initial data
  const insertEleveQuery = `INSERT INTO eleves (nom, prenom, age) VALUES ?`;
  const elevesData = [
    ['Jean', 'Dupont', 15],
    ['Marie', 'Durand', 16],
    ['Paul', 'Martin', 14],
    ['Julie', 'Lefevre', 15]
  ];
  db.query(insertEleveQuery, [elevesData], (err, result) => {
    if (err) throw err;
    console.log('Initial data inserted.');
  });
});

app.get('/', (req, res) => {
    const selectAllElevesQuery = 'SELECT * FROM eleves';
    db.query(selectAllElevesQuery, (err, results) => {
        if (err) throw err;
        // Format the results before sending
        const formattedResults = results.map(eleve => {
            return {
                id: eleve.id,
                nom: eleve.nom,
                prenom: eleve.prenom,
                age: eleve.age
            };
        });
        res.send(formattedResults);
    });
});

app.use(express.json());

app.post('/', (req, res) => {
    const { nom, prenom, age } = req.body;
    const insertEleveQuery = `INSERT INTO eleves (nom, prenom, age) VALUES (?, ?, ?)`;
    db.query(insertEleveQuery, [nom, prenom, age], (err, result) => {
        if (err) throw err;
        console.log('New student inserted.');
        res.send('New student inserted.');
    });
});

app.listen(3000, () => {
  console.log('Le serveur est en écoute sur le port 3000');
});