const { Pool } = require('pg');

class ServiceOptionsService {
  constructor(pool) {
    this.pool = pool;
  }

  // Création de la table service_options si elle n'existe pas
  async createTable() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS service_options (
          id SERIAL PRIMARY KEY,
          vehicle_type VARCHAR(50) NOT NULL,
          option_name VARCHAR(100) NOT NULL,
          option_value BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(vehicle_type, option_name)
        );
      `);
      console.log('✅ Table service_options créée avec succès');
    } catch (err) {
      console.error('❌ Erreur lors de la création de la table service_options:', err);
      throw err;
    }
  }

  // Récupérer toutes les options pour un type de véhicule
  async getOptionsForVehicleType(vehicleType) {
    try {
      const result = await this.pool.query(
        'SELECT * FROM service_options WHERE vehicle_type = $1',
        [vehicleType]
      );
      
      // Convertir en format objet pour faciliter l'utilisation
      const options = {};
      result.rows.forEach(row => {
        options[row.option_name] = row.option_value;
      });
      
      return options;
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des options:', err);
      throw err;
    }
  }

  // Mettre à jour ou créer une option
  async setOption(vehicleType, optionName, optionValue) {
    try {
      const result = await this.pool.query(`
        INSERT INTO service_options (vehicle_type, option_name, option_value, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (vehicle_type, option_name)
        DO UPDATE SET 
          option_value = EXCLUDED.option_value,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `, [vehicleType, optionName, optionValue]);

      console.log(`✅ Option "${optionName}" pour "${vehicleType}" définie à ${optionValue}`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour de l\'option:', err);
      throw err;
    }
  }

  // Récupérer une option spécifique
  async getOption(vehicleType, optionName) {
    try {
      const result = await this.pool.query(
        'SELECT option_value FROM service_options WHERE vehicle_type = $1 AND option_name = $2',
        [vehicleType, optionName]
      );
      
      if (result.rows.length === 0) {
        return false; // Par défaut, les options sont désactivées
      }
      
      return result.rows[0].option_value;
    } catch (err) {
      console.error('❌ Erreur lors de la récupération de l\'option:', err);
      throw err;
    }
  }

  // Supprimer une option
  async deleteOption(vehicleType, optionName) {
    try {
      const result = await this.pool.query(
        'DELETE FROM service_options WHERE vehicle_type = $1 AND option_name = $2 RETURNING *',
        [vehicleType, optionName]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Option non trouvée');
      }

      console.log(`✅ Option "${optionName}" pour "${vehicleType}" supprimée`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de l\'option:', err);
      throw err;
    }
  }

  // Récupérer toutes les options pour tous les types de véhicules
  async getAllOptions() {
    try {
      const result = await this.pool.query('SELECT * FROM service_options ORDER BY vehicle_type, option_name');
      return result.rows;
    } catch (err) {
      console.error('❌ Erreur lors de la récupération de toutes les options:', err);
      throw err;
    }
  }
}

module.exports = ServiceOptionsService; 