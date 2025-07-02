const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour la production
const corsOptions = {
  origin: function (origin, callback) {
    // Récupérer les domaines autorisés depuis les variables d'environnement
    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
    const allowedOrigins = allowedOriginsEnv ? 
      allowedOriginsEnv.split(',').map(domain => domain.trim()) : 
      [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://darkgray-horse-917532.hostingersite.com'
      ];
    
    console.log('🔍 CORS - Origin demandée:', origin);
    console.log('🔍 CORS - Domaines autorisés:', allowedOrigins);
    
    // En développement, autorise toutes les origines
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ CORS - Mode développement, autorisation accordée');
      return callback(null, true);
    }
    
    // En production, vérifie les domaines autorisés
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS - Origine autorisée');
      callback(null, true);
    } else {
      console.log('❌ CORS - Origine refusée');
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true
};

// Middleware pour parser le JSON et CORS
app.use(cors(corsOptions));
app.use(express.json());

// Configuration de la connexion PostgreSQL
const pool = new Pool(
  // Si DATABASE_URL est définie (production), l'utiliser
  process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  } : 
  // Sinon, utiliser la configuration locale
  {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '2002'
  }
);

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

// Import des services
const PetiteCitadineService = require('./server/petiteCitadineService.cjs');
const CitadineService = require('./server/citadineService.cjs');
const BerlineService = require('./server/berlineService.cjs');
const SuvService = require('./server/suvService.cjs');
const createPetiteCitadineRoutes = require('./server/routes/petiteCitadineRoutes.cjs');
const createCitadineRoutes = require('./server/routes/citadineRoutes.cjs');
const createBerlineRoutes = require('./server/routes/berlineRoutes.cjs');
const createSuvRoutes = require('./server/routes/suvRoutes.cjs');
const reservationRoutes = require('./server/routes/reservationRoutes.cjs');
const { createReservationsTable } = require('./server/reservationService.cjs');

// Initialiser les services
const petiteCitadineService = new PetiteCitadineService(pool);
const citadineService = new CitadineService(pool);
const berlineService = new BerlineService(pool);
const suvService = new SuvService(pool);

// Initialiser la base de données
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initialisation de la base de données...');
    await createAdminTable();
    await petiteCitadineService.createTable();
    await citadineService.createTable();
    await berlineService.createTable();
    await suvService.createTable();
    // await createReservationsTable(); // Table créée manuellement
    console.log('✅ Base de données initialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    // Ne pas faire planter l'app, juste logger l'erreur
  }
};

initializeDatabase();

// Test de la connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL:', err);
  } else {
    console.log('Connexion à PostgreSQL réussie!');
  }
});

// Configuration des routes API modulaires AVANT les fichiers statiques
app.use('/api/formules/petite-citadine', createPetiteCitadineRoutes(petiteCitadineService));
app.use('/api/formules/citadine', createCitadineRoutes(citadineService));
app.use('/api/formules/berline', createBerlineRoutes(berlineService));
app.use('/api/formules/suv', createSuvRoutes(suvService));
app.use('/api/reservations', reservationRoutes);

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

// Route pour changer le mot de passe admin
app.post('/api/admin/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    console.log('🔐 Tentative de changement de mot de passe admin'); // Debug log
    
    // Validation des données d'entrée
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Mot de passe actuel et nouveau mot de passe requis' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' 
      });
    }
    
    // Récupérer l'admin actuel
    const result = await pool.query('SELECT * FROM loginAdmin WHERE username = $1', ['admin']);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Administrateur non trouvé' 
      });
    }
    
    const admin = result.rows[0];
    
    // Vérifier l'ancien mot de passe
    const validCurrentPassword = await bcrypt.compare(currentPassword, admin.password);
    
    if (!validCurrentPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Mot de passe actuel incorrect' 
      });
    }
    
    // Vérifier que le nouveau mot de passe est différent de l'ancien
    const samePassword = await bcrypt.compare(newPassword, admin.password);
    if (samePassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Le nouveau mot de passe doit être différent de l\'ancien' 
      });
    }
    
    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Mettre à jour le mot de passe dans la base de données
    await pool.query(
      'UPDATE loginAdmin SET password = $1 WHERE username = $2',
      [hashedNewPassword, 'admin']
    );
    
    console.log('✅ Mot de passe admin modifié avec succès');
    
    res.json({ 
      success: true, 
      message: 'Mot de passe modifié avec succès' 
    });
    
  } catch (err) {
    console.error('❌ Erreur lors du changement de mot de passe:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors du changement de mot de passe' 
    });
  }
});

// Middleware pour servir les fichiers statiques (APRÈS les routes API)
app.use(express.static(path.join(__dirname, 'dist')));

// Route pour la page d'accueil (SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Gestion des erreurs non gérées
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
});

// Middleware de gestion d'erreur global
app.use((error, req, res, next) => {
  console.error('❌ Erreur serveur:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚗 Serveur LADL démarré sur http://localhost:${PORT}`);
});

module.exports = app; 