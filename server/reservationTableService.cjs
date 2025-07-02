const { Pool } = require('pg');

// Utilise la même configuration que les autres services
let pool;

const initPool = (poolInstance) => {
  pool = poolInstance;
};

// Service pour gérer la table des réservations
class ReservationTableService {
  
  static async createTable() {
    try {
      console.log('🔄 Vérification/création de la table reservations...');
      
      // Créer la table principale
      await pool.query(`
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

      // Créer les index pour améliorer les performances
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_reservations_date_rdv 
        ON reservations(date_rdv)
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_reservations_status 
        ON reservations(status)
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_reservations_email 
        ON reservations(email)
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_reservations_type_voiture 
        ON reservations(type_voiture)
      `);

      // Ajouter une contrainte pour vérifier le statut (si elle n'existe pas déjà)
      try {
        await pool.query(`
          ALTER TABLE reservations 
          ADD CONSTRAINT check_status 
          CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
        `);
      } catch (error) {
        // La contrainte existe déjà, pas d'erreur
        if (!error.message.includes('already exists')) {
          console.warn('⚠️ Avertissement contrainte statut:', error.message);
        }
      }

      // Ajouter les commentaires sur la table et les colonnes
      try {
        await pool.query(`
          COMMENT ON TABLE reservations IS 'Table des réservations de services de lavage de véhicules'
        `);
        
        await pool.query(`
          COMMENT ON COLUMN reservations.prix IS 'Prix en euros de la formule choisie'
        `);
        
        await pool.query(`
          COMMENT ON COLUMN reservations.date_rdv IS 'Date du rendez-vous'
        `);
        
        await pool.query(`
          COMMENT ON COLUMN reservations.heure_rdv IS 'Heure du rendez-vous au format HH:MM'
        `);
        
        await pool.query(`
          COMMENT ON COLUMN reservations.status IS 'Statut: pending, confirmed, cancelled, completed'
        `);
      } catch (error) {
        // Les commentaires peuvent échouer selon les permissions, mais ce n'est pas critique
        console.warn('⚠️ Impossible d\'ajouter les commentaires (permissions)');
      }

      console.log('✅ Table reservations créée/vérifiée avec succès');
      return { success: true };

    } catch (error) {
      console.error('❌ Erreur lors de la création de la table reservations:', error);
      throw error;
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