const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour autoriser Hostinger et Render
const corsOptions = {
  origin: [
    'http://localhost:5173', // Développement local
    'http://localhost:3000',
    'https://greenyellow-rat-105874.hostingersite.com', // Votre domaine Hostinger
    /\.hostingersite\.com$/, // Tous les domaines Hostinger
    /\.onrender\.com$/ // Tous les domaines Render
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware pour parser le JSON et CORS
app.use(cors(corsOptions));
app.use(express.json());

// Configuration de la connexion PostgreSQL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.sgcpymrobdjbcpzjmaos:Les_As_De_Auto_2025@aws-0-eu-west-3.pooler.supabase.com:5432/postgres';

console.log('🔍 DATABASE_URL format:', DATABASE_URL ? 'Définie' : 'Non définie');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test de la connexion avec gestion d'erreur améliorée
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Connexion à PostgreSQL réussie!', result.rows[0]);
  } catch (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
    console.error('Variables d\'environnement disponibles:', {
      DATABASE_URL: process.env.DATABASE_URL ? 'Définie' : 'Non définie',
      NODE_ENV: process.env.NODE_ENV
    });
    
    // En production, l'application ne peut pas fonctionner sans BDD
    if (process.env.NODE_ENV === 'production') {
      console.error('💥 Impossible de continuer sans base de données en production');
      process.exit(1);
    }
  }
};

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
      console.log('✅ Admin par défaut créé avec succès');
    } else {
      console.log('✅ Admin existe déjà');
    }
  } catch (err) {
    console.error('❌ Erreur lors de la création de la table loginAdmin:', err.message);
    throw err;
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
const newsletterRoutes = require('./server/routes/newsletterRoutes.cjs');
const contactRoutes = require('./server/routes/contactRoutes.cjs');
const { ReservationTableService, initPool } = require('./server/reservationTableService.cjs');

// Initialiser les services
const petiteCitadineService = new PetiteCitadineService(pool);
const citadineService = new CitadineService(pool);
const berlineService = new BerlineService(pool);
const suvService = new SuvService(pool);

// Initialiser le pool pour le service de réservation
initPool(pool);

// Initialiser la base de données
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initialisation de la base de données...');
    await testConnection();
    await createAdminTable();
    await petiteCitadineService.createTable();
    await citadineService.createTable();
    await berlineService.createTable();
    await suvService.createTable();
    await ReservationTableService.createTable();
    console.log('✅ Base de données initialisée avec succès!');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', err.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

initializeDatabase();

// Configuration des routes API modulaires
try {
  app.use('/api/formules/petite-citadine', createPetiteCitadineRoutes(petiteCitadineService));
  app.use('/api/formules/citadine', createCitadineRoutes(citadineService));
  app.use('/api/formules/berline', createBerlineRoutes(berlineService));
  app.use('/api/formules/suv', createSuvRoutes(suvService));
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/contact', contactRoutes);
  console.log('✅ Routes API configurées avec succès');
} catch (err) {
  console.error('❌ Erreur lors de la configuration des routes:', err.message);
}

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

// Route de santé pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({ 
    message: 'LADL Backend API', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Route 404 pour les endpoints non trouvés
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint non trouvé',
    path: req.originalUrl,
    method: req.method
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚗 Serveur LADL démarré sur http://localhost:${PORT}`);
});

module.exports = app; 