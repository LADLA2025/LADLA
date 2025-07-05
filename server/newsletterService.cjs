const { Pool } = require('pg');

// Configuration de la base de données
const pool = new Pool({
  connectionString: 'postgresql://postgres.sgcpymrobdjbcpzjmaos:Les_As_De_Auto_2025@aws-0-eu-west-3.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

class NewsletterService {
  // Récupérer tous les abonnés à la newsletter
  static async getAllSubscribers() {
    try {
      const query = `
        SELECT id, email, nom, prenom, status, source, created_at, updated_at
        FROM newsletter_subscribers
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query);
      
      return {
        success: true,
        data: result.rows,
        count: result.rows.length
      };
      
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnés:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des abonnés'
      };
    }
  }

  // Ajouter un nouvel abonné
  static async addSubscriber(email, nom = null, prenom = null, source = 'website') {
    try {
      const query = `
        INSERT INTO newsletter_subscribers (email, nom, prenom, source, status)
        VALUES ($1, $2, $3, $4, 'active')
        ON CONFLICT (email) 
        DO UPDATE SET 
          nom = COALESCE($2, newsletter_subscribers.nom),
          prenom = COALESCE($3, newsletter_subscribers.prenom),
          status = 'active',
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      
      const result = await pool.query(query, [email, nom, prenom, source]);
      
      return {
        success: true,
        data: result.rows[0],
        message: 'Abonné ajouté avec succès'
      };
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'abonné:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'ajout de l\'abonné'
      };
    }
  }

  // Mettre à jour le statut d'un abonné
  static async updateSubscriberStatus(id, status) {
    try {
      const validStatuses = ['active', 'inactive', 'unsubscribed'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          error: 'Statut invalide'
        };
      }

      const query = `
        UPDATE newsletter_subscribers
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await pool.query(query, [status, id]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Abonné non trouvé'
        };
      }
      
      return {
        success: true,
        data: result.rows[0],
        message: 'Statut mis à jour avec succès'
      };
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du statut'
      };
    }
  }

  // Supprimer un abonné
  static async deleteSubscriber(id) {
    try {
      const query = `
        DELETE FROM newsletter_subscribers
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Abonné non trouvé'
        };
      }
      
      return {
        success: true,
        data: result.rows[0],
        message: 'Abonné supprimé avec succès'
      };
      
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'abonné:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression de l\'abonné'
      };
    }
  }

  // Statistiques de la newsletter
  static async getStats() {
    try {
      const queries = [
        'SELECT COUNT(*) as total FROM newsletter_subscribers',
        'SELECT COUNT(*) as active FROM newsletter_subscribers WHERE status = \'active\'',
        'SELECT COUNT(*) as inactive FROM newsletter_subscribers WHERE status = \'inactive\'',
        'SELECT COUNT(*) as unsubscribed FROM newsletter_subscribers WHERE status = \'unsubscribed\'',
        'SELECT source, COUNT(*) as count FROM newsletter_subscribers GROUP BY source'
      ];
      
      const [totalResult, activeResult, inactiveResult, unsubscribedResult, sourceResult] = await Promise.all(
        queries.map(query => pool.query(query))
      );
      
      return {
        success: true,
        data: {
          total: parseInt(totalResult.rows[0].total),
          active: parseInt(activeResult.rows[0].active),
          inactive: parseInt(inactiveResult.rows[0].inactive),
          unsubscribed: parseInt(unsubscribedResult.rows[0].unsubscribed),
          bySource: sourceResult.rows.map(row => ({
            source: row.source,
            count: parseInt(row.count)
          }))
        }
      };
      
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des statistiques'
      };
    }
  }

  // Exporter les abonnés actifs
  static async getActiveSubscribers() {
    try {
      const query = `
        SELECT email, nom, prenom, created_at
        FROM newsletter_subscribers
        WHERE status = 'active'
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query);
      
      return {
        success: true,
        data: result.rows,
        count: result.rows.length
      };
      
    } catch (error) {
      console.error('Erreur lors de l\'export des abonnés actifs:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'export des abonnés actifs'
      };
    }
  }
}

module.exports = NewsletterService; 