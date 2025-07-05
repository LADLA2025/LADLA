const { Pool } = require('pg');

// Configuration de la base de données
const pool = new Pool({
  connectionString: 'postgresql://postgres.sgcpymrobdjbcpzjmaos:Les_As_De_Auto_2025@aws-0-eu-west-3.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

class ContactService {
  // Récupérer tous les messages de contact
  static async getAllMessages() {
    try {
      const query = `
        SELECT id, nom, email, message, status, created_at, updated_at
        FROM contact_messages
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query);
      
      return {
        success: true,
        data: result.rows,
        count: result.rows.length
      };
      
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des messages'
      };
    }
  }

  // Ajouter un nouveau message de contact
  static async addMessage(nom, email, message) {
    try {
      const query = `
        INSERT INTO contact_messages (nom, email, message, status)
        VALUES ($1, $2, $3, 'unread')
        RETURNING *
      `;
      
      const result = await pool.query(query, [nom, email, message]);
      
      return {
        success: true,
        data: result.rows[0],
        message: 'Message envoyé avec succès'
      };
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du message:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'envoi du message'
      };
    }
  }

  // Mettre à jour le statut d'un message
  static async updateMessageStatus(id, status) {
    try {
      const validStatuses = ['unread', 'read', 'replied'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          error: 'Statut invalide'
        };
      }

      const query = `
        UPDATE contact_messages
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await pool.query(query, [status, id]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Message non trouvé'
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

  // Supprimer un message
  static async deleteMessage(id) {
    try {
      const query = `
        DELETE FROM contact_messages
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Message non trouvé'
        };
      }
      
      return {
        success: true,
        data: result.rows[0],
        message: 'Message supprimé avec succès'
      };
      
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression du message'
      };
    }
  }

  // Statistiques des messages de contact
  static async getStats() {
    try {
      const queries = [
        'SELECT COUNT(*) as total FROM contact_messages',
        'SELECT COUNT(*) as unread FROM contact_messages WHERE status = \'unread\'',
        'SELECT COUNT(*) as read FROM contact_messages WHERE status = \'read\'',
        'SELECT COUNT(*) as replied FROM contact_messages WHERE status = \'replied\'',
        'SELECT DATE(created_at) as date, COUNT(*) as count FROM contact_messages GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30'
      ];
      
      const [totalResult, unreadResult, readResult, repliedResult, dailyResult] = await Promise.all(
        queries.map(query => pool.query(query))
      );
      
      return {
        success: true,
        data: {
          total: parseInt(totalResult.rows[0].total),
          unread: parseInt(unreadResult.rows[0].unread),
          read: parseInt(readResult.rows[0].read),
          replied: parseInt(repliedResult.rows[0].replied),
          daily: dailyResult.rows.map(row => ({
            date: row.date,
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

  // Récupérer les messages non lus
  static async getUnreadMessages() {
    try {
      const query = `
        SELECT id, nom, email, message, created_at
        FROM contact_messages
        WHERE status = 'unread'
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query);
      
      return {
        success: true,
        data: result.rows,
        count: result.rows.length
      };
      
    } catch (error) {
      console.error('Erreur lors de la récupération des messages non lus:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des messages non lus'
      };
    }
  }

  // Marquer plusieurs messages comme lus
  static async markMultipleAsRead(ids) {
    try {
      const query = `
        UPDATE contact_messages
        SET status = 'read', updated_at = CURRENT_TIMESTAMP
        WHERE id = ANY($1::int[])
        RETURNING *
      `;
      
      const result = await pool.query(query, [ids]);
      
      return {
        success: true,
        data: result.rows,
        message: `${result.rows.length} message(s) marqué(s) comme lu(s)`
      };
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour multiple:', error);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour multiple'
      };
    }
  }

  // Supprimer plusieurs messages
  static async deleteMultipleMessages(ids) {
    try {
      const query = `
        DELETE FROM contact_messages
        WHERE id = ANY($1::int[])
        RETURNING *
      `;
      
      const result = await pool.query(query, [ids]);
      
      return {
        success: true,
        data: result.rows,
        message: `${result.rows.length} message(s) supprimé(s)`
      };
      
    } catch (error) {
      console.error('Erreur lors de la suppression multiple:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression multiple'
      };
    }
  }
}

module.exports = ContactService; 