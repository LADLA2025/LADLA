const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.sgcpymrobdjbcpzjmaos:Les_As_De_Auto_2025@aws-0-eu-west-3.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testTables() {
  try {
    console.log('🔄 Test de connexion Supabase...');
    
    // Test de connexion
    const client = await pool.connect();
    console.log('✅ Connexion Supabase réussie !');
    
    // Lister toutes les tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    console.log('\n📋 Tables existantes dans Supabase :');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Tester chaque table de formules
    const formulesTables = ['formules_petite_citadine', 'formules_citadine', 'formules_berline', 'formules_suv'];
    
    console.log('\n🔍 Test des tables de formules :');
    for (const tableName of formulesTables) {
      try {
        const testQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
        const result = await client.query(testQuery);
        console.log(`  ✅ ${tableName}: ${result.rows[0].count} enregistrements`);
      } catch (error) {
        console.log(`  ❌ ${tableName}: ${error.message}`);
      }
    }
    
    // Tester la table reservations
    console.log('\n🎯 Test table reservations :');
    try {
      const reservationQuery = `SELECT COUNT(*) as count FROM reservations`;
      const result = await client.query(reservationQuery);
      console.log(`  ✅ reservations: ${result.rows[0].count} enregistrements`);
    } catch (error) {
      console.log(`  ❌ reservations: ${error.message}`);
    }
    
    client.release();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

testTables(); 