const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://postgres.mmzywkqwiwdrdtkocrtj:Edward2002%40%40@aws-0-eu-west-3.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createReservationsTable() {
  try {
    console.log('🔄 Connexion à Supabase...');
    
    const client = await pool.connect();
    console.log('✅ Connexion réussie !');
    
    console.log('🔄 Création de la table reservations...');
    
    // Lire le fichier SQL
    const sqlContent = fs.readFileSync('create-reservations-table.sql', 'utf8');
    
    // Exécuter le SQL
    await client.query(sqlContent);
    
    console.log('✅ Table reservations créée avec succès !');
    
    // Vérifier que la table existe
    const checkQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'reservations'
    `;
    
    const result = await client.query(checkQuery);
    
    if (result.rows.length > 0) {
      console.log('✅ Vérification : Table reservations existe bien !');
    } else {
      console.log('❌ Erreur : Table reservations non trouvée après création');
    }
    
    client.release();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error.message);
    process.exit(1);
  }
}

createReservationsTable(); 