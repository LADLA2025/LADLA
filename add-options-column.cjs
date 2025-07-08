const { Pool } = require('pg');

// Configuration de la base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.mmzywkqwiwdrdtkocrtj:Edward2002%40%40@aws-0-eu-west-3.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function addOptionsColumn() {
  const client = await pool.connect();
  try {
    console.log('🔄 Vérification de la structure de la table reservations...');
    
    // Vérifier si la colonne exists déjà
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reservations' 
      AND column_name = 'options'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ La colonne options existe déjà');
      return;
    }
    
    console.log('📝 Ajout de la colonne options...');
    
    // Ajouter la colonne options
    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN options JSONB
    `);
    
    console.log('✅ Colonne options ajoutée avec succès');
    
    // Vérifier la structure finale
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reservations' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Structure de la table reservations:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la colonne:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter la migration
addOptionsColumn(); 