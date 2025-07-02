const { Pool } = require('pg');

// Utilise la même configuration que les autres services
let pool;

const initPool = (poolInstance) => {
  pool = poolInstance;
};

// Service pour gérer la table des réservations
class ReservationTableService {
  
  static async createTable() {
    const client = await pool.connect();
    try {
      console.log('🔄 Vérification/création de la table reservations...');
      
      await client.query('BEGIN');

      // Créer la table principale
      await client.query(`
        CREATE TABLE IF NOT EXISTS reservations (
          id SERIAL PRIMARY KEY,
          prenom VARCHAR(100) NOT NULL,
          nom VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL,
          telephone VARCHAR(20) NOT NULL,
          adresse TEXT NOT NULL,
          type_voiture VARCHAR(50) NOT NULL,
          marque_voiture VARCHAR(100) NOT NULL,
          formule VARCHAR(255) NOT NULL,
          prix DECIMAL(10,2),
          date_rdv DATE NOT NULL,
          heure_rdv TIME NOT NULL,
          commentaires TEXT,
          newsletter BOOLEAN DEFAULT false,
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Créer les index pour améliorer les performances (en une seule fois)
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reservations_date_rdv') THEN
            CREATE INDEX idx_reservations_date_rdv ON reservations(date_rdv);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reservations_status') THEN
            CREATE INDEX idx_reservations_status ON reservations(status);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reservations_email') THEN
            CREATE INDEX idx_reservations_email ON reservations(email);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reservations_type_voiture') THEN
            CREATE INDEX idx_reservations_type_voiture ON reservations(type_voiture);
          END IF;
        END
        $$;
      `);

      // Ajouter une contrainte pour vérifier le statut (si elle n'existe pas déjà)
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'check_status' 
            AND table_name = 'reservations'
          ) THEN
            ALTER TABLE reservations 
            ADD CONSTRAINT check_status 
            CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));
          END IF;
        END
        $$;
      `);

      await client.query('COMMIT');
      console.log('✅ Table reservations créée/vérifiée avec succès');
      return { success: true };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Erreur lors de la création de la table reservations:', error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  // Vérifier si la table existe
  static async tableExists() {
    try {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'reservations'
        );
      `);
      return result.rows[0].exists;
    } catch (error) {
      console.error('Erreur vérification table reservations:', error);
      return false;
    }
  }

  // Obtenir des statistiques sur la table
  static async getTableStats() {
    try {
      const exists = await this.tableExists();
      if (!exists) {
        return { exists: false };
      }

      const countResult = await pool.query('SELECT COUNT(*) as count FROM reservations');
      const statusResult = await pool.query(`
        SELECT status, COUNT(*) as count 
        FROM reservations 
        GROUP BY status 
        ORDER BY status
      `);

      return {
        exists: true,
        totalReservations: parseInt(countResult.rows[0].count),
        statusBreakdown: statusResult.rows
      };
    } catch (error) {
      console.error('Erreur statistiques table reservations:', error);
      return { exists: false, error: error.message };
    }
  }
}

module.exports = {
  ReservationTableService,
  initPool
}; 