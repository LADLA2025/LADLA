const { Pool } = require('pg');

class BerlineService {
  constructor(pool) {
    this.pool = pool;
  }

  // Création de la table formules_berline si elle n'existe pas
  async createTable() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS formules_berline (
          id SERIAL PRIMARY KEY,
          nom VARCHAR(100) NOT NULL,
          prix DECIMAL(10,2) NOT NULL,
          duree VARCHAR(50) NOT NULL,
          icone VARCHAR(50) NOT NULL,
          services TEXT[] NOT NULL,
          lavage_premium BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Ajouter la colonne lavage_premium si elle n'existe pas déjà
      try {
        await this.pool.query(`
          ALTER TABLE formules_berline 
          ADD COLUMN IF NOT EXISTS lavage_premium BOOLEAN DEFAULT FALSE;
        `);
      } catch (alterErr) {
        // Ignorer l'erreur si la colonne existe déjà
        console.log('Note: Colonne lavage_premium déjà existante ou erreur lors de l\'ajout');
      }

      // Ajouter la colonne lavage_premium_prix si elle n'existe pas déjà
      try {
        await this.pool.query(`
          ALTER TABLE formules_berline 
          ADD COLUMN IF NOT EXISTS lavage_premium_prix DECIMAL(10,2);
        `);
      } catch (alterErr) {
        // Ignorer l'erreur si la colonne existe déjà
        console.log('Note: Colonne lavage_premium_prix déjà existante ou erreur lors de l\'ajout');
      }
      console.log('✅ Table formules_berline créée avec succès');
    } catch (err) {
      console.error('❌ Erreur lors de la création de la table formules_berline:', err);
      throw err;
    }
  }

  // Récupérer toutes les formules berline
  async getAllFormules() {
    try {
      const result = await this.pool.query('SELECT * FROM formules_berline ORDER BY created_at DESC');
      return result.rows;
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des formules:', err);
      throw err;
    }
  }

  // Ajouter une nouvelle formule berline
  async addFormule(formuleData) {
    try {
      const { nom, prix, duree, icone, services, lavage_premium = false, lavage_premium_prix } = formuleData;

      // Validation des données
      if (!nom || !prix || !duree || !icone || !services || !Array.isArray(services)) {
        throw new Error('Tous les champs sont requis et services doit être un tableau');
      }

      const result = await this.pool.query(
        'INSERT INTO formules_berline (nom, prix, duree, icone, services, lavage_premium, lavage_premium_prix) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [nom, prix, duree, icone, services, lavage_premium, lavage_premium_prix]
      );

      console.log(`✅ Formule "${nom}" ajoutée avec succès`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de l\'ajout de la formule:', err);
      throw err;
    }
  }

  // Supprimer une formule berline
  async deleteFormule(id) {
    try {
      const result = await this.pool.query('DELETE FROM formules_berline WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Formule non trouvée');
      }

      console.log(`✅ Formule ID ${id} supprimée avec succès`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de la formule:', err);
      throw err;
    }
  }

  // Mettre à jour une formule berline
  async updateFormule(id, formuleData) {
    try {
      const { nom, prix, duree, icone, services, lavage_premium = false, lavage_premium_prix } = formuleData;

      // Validation des données
      if (!nom || !prix || !duree || !icone || !services || !Array.isArray(services)) {
        throw new Error('Tous les champs sont requis et services doit être un tableau');
      }

      const result = await this.pool.query(
        'UPDATE formules_berline SET nom = $1, prix = $2, duree = $3, icone = $4, services = $5, lavage_premium = $6, lavage_premium_prix = $7 WHERE id = $8 RETURNING *',
        [nom, prix, duree, icone, services, lavage_premium, lavage_premium_prix, id]
      );

      if (result.rows.length === 0) {
        throw new Error('Formule non trouvée');
      }

      console.log(`✅ Formule ID ${id} mise à jour avec succès`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour de la formule:', err);
      throw err;
    }
  }

  // Mettre à jour seulement le prix du lavage premium
  async updateLavagePremiumPrice(id, lavage_premium_prix) {
    try {
      const result = await this.pool.query(
        'UPDATE formules_berline SET lavage_premium_prix = $1 WHERE id = $2 RETURNING *',
        [lavage_premium_prix, id]
      );

      if (result.rows.length === 0) {
        throw new Error('Formule non trouvée');
      }

      console.log(`✅ Prix lavage premium mis à jour pour la formule ID ${id}`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du prix lavage premium:', err);
      throw err;
    }
  }

  // Obtenir une formule par ID
  async getFormuleById(id) {
    try {
      const result = await this.pool.query('SELECT * FROM formules_berline WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Formule non trouvée');
      }

      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la récupération de la formule:', err);
      throw err;
    }
  }

  // Obtenir le nombre total de formules
  async getFormulesCount() {
    try {
      const result = await this.pool.query('SELECT COUNT(*) FROM formules_berline');
      return parseInt(result.rows[0].count);
    } catch (err) {
      console.error('❌ Erreur lors du comptage des formules:', err);
      throw err;
    }
  }
}

module.exports = BerlineService; 