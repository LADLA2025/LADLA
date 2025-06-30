const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON et CORS
app.use(cors());
app.use(express.json());

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD
});

// Création de la table loginAdmin si elle n'existe pas
const createAdminTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS loginAdmin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Vérifier si un admin existe déjà
    const adminExists = await pool.query('SELECT * FROM loginAdmin WHERE username = $1', ['admin']);
    
    if (adminExists.rows.length === 0) {
      // Créer l'admin par défaut avec le mot de passe hashé
      const hashedPassword = await bcrypt.hash('Les_As_De_Auto_2025', 10);
      await pool.query(
        'INSERT INTO loginAdmin (username, password) VALUES ($1, $2)',
        ['admin', hashedPassword]
      );
      console.log('Admin par défaut créé avec succès');
    }
  } catch (err) {
    console.error('Erreur lors de la création de la table loginAdmin:', err);
  }
};

// Initialiser la base de données
createAdminTable();

// Test de la connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL:', err);
  } else {
    console.log('Connexion à PostgreSQL réussie!');
  }
});

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Exemple de route utilisant PostgreSQL
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour la connexion admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    console.log('Tentative de connexion avec le mot de passe:', password); // Debug log
    
    // Récupérer l'admin
    const result = await pool.query('SELECT * FROM loginAdmin WHERE username = $1', ['admin']);
    
    if (result.rows.length === 0) {
      console.log('Aucun admin trouvé'); // Debug log
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, result.rows[0].password);
    console.log('Résultat de la vérification du mot de passe:', validPassword); // Debug log
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    
    res.json({ success: true, message: 'Connexion réussie' });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚗 Serveur LADL démarré sur http://localhost:${PORT}`);
});

module.exports = app; 