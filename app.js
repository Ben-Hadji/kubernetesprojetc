require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Configure PostgreSQL connection
const pool = new Pool({
  host: "dpg-cnuor7md3nmc73abjrf0-a.oregon-postgres.render.com",
  user: "eleves_user",
  password: "FCwlX5t1Y2QF2JLyf6RIgEVX7xdZ1uHq",
  port: 5432,
  database: "eleves",
  ssl: { rejectUnauthorized: false }
});

// Create 'eleves' table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS eleves (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  age INT
  )
`;

pool.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
    return;
  }
  console.log('Table \'eleves\' created.');

  // Check if the table is empty
  pool.query('SELECT COUNT(*) FROM eleves', (err, result) => {
    if (err) {
      console.error('Error counting rows:', err);
      return;
    }

    // Insert initial data if the table is empty
    if (parseInt(result.rows[0].count) === 0) {
      const initialData = [
        ['Jean', 'Dupont', 15],
        ['Marie', 'Durand', 16],
        ['Paul', 'Martin', 14],
        ['Julie', 'Lefevre', 15]
      ];
      const insertInitialDataQuery = `INSERT INTO eleves (nom, prenom, age) VALUES ($1, $2, $3)`;
      initialData.forEach(data => {
        pool.query(insertInitialDataQuery, data, (err, result) => {
          if (err) {
            console.error('Error inserting initial data:', err);
            return;
          }
        });
      });
      console.log('Initial data inserted.');
    }
  });
});

// Service POST pour ajouter un nouvel élève
app.post('/eleves', (req, res) => {
  const { nom, prenom, age } = req.body;
  const insertEleveQuery = `INSERT INTO eleves (nom, prenom, age) VALUES ($1, $2, $3)`;
  pool.query(insertEleveQuery, [nom, prenom, age], (err, result) => {
    if (err) {
      console.error('Error inserting new student:', err);
      res.status(500).send('Error inserting new student');
    } else {
      console.log('New student inserted.');
      res.status(201).send('New student inserted.');
    }
  });
});

// Service GET pour récupérer tous les élèves existants
app.get('/eleves', (req, res) => {
  const selectAllElevesQuery = 'SELECT * FROM eleves';
  pool.query(selectAllElevesQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving students:', err);
      res.status(500).send('Error retrieving students');
    } else {
      // Format the results before sending
      const formattedResults = results.rows.map(eleve => {
        return {
          id: eleve.id,
          nom: eleve.nom,
          prenom: eleve.prenom,
          age: eleve.age
        };
      });
      res.status(200).json(formattedResults);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
