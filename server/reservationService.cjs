const { Pool } = require('pg');

// Configuration de la base de données (utilise la même config que le serveur principal)
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '2002'
});

// Création de la table des réservations
const createReservationsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        -- Informations client
        prenom VARCHAR(100) NOT NULL,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        adresse TEXT NOT NULL,
        
        -- Informations véhicule et service
        type_voiture VARCHAR(50) NOT NULL,
        marque_voiture VARCHAR(100) NOT NULL,
        formule VARCHAR(255) NOT NULL,
        prix DECIMAL(10,2),
        
        -- Informations rendez-vous
        date_rdv DATE NOT NULL,
        heure_rdv TIME NOT NULL,
        
        -- Informations supplémentaires
        commentaires TEXT,
        newsletter BOOLEAN DEFAULT false,
        
        -- Statut de la réservation
        status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table reservations créée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table reservations:', error);
  }
};

// Service de gestion des réservations
class ReservationService {
  
  // Créer une nouvelle réservation
  static async createReservation(reservationData) {
    try {
      const {
        prenom, nom, email, telephone, adresse,
        typeVoiture, marqueVoiture, formule, prix,
        date, heure, commentaires, newsletter
      } = reservationData;

      // Vérifier les conflits de créneaux avant de créer la réservation
      const conflictCheck = await ReservationService.checkTimeSlotConflict(
        date, heure, typeVoiture, formule
      );

      if (!conflictCheck.success) {
        return {
          success: false,
          error: conflictCheck.error || 'Erreur lors de la vérification des conflits'
        };
      }

      if (conflictCheck.conflict) {
        return {
          success: false,
          error: conflictCheck.message || 'Ce créneau est déjà occupé'
        };
      }

      const query = `
        INSERT INTO reservations (
          prenom, nom, email, telephone, adresse,
          type_voiture, marque_voiture, formule, prix,
          date_rdv, heure_rdv, commentaires, newsletter, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        prenom, nom, email, telephone, adresse,
        typeVoiture, marqueVoiture, formule, prix || 0,
        date, heure, commentaires || '', newsletter || false, 'pending'
      ];

      const result = await pool.query(query, values);
      return {
        success: true,
        data: result.rows[0],
        message: 'Réservation créée avec succès'
      };

    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      return {
        success: false,
        error: 'Erreur lors de la création de la réservation'
      };
    }
  }

  // Récupérer toutes les réservations avec filtres
  static async getAllReservations(filters = {}) {
    try {
      const { date_debut, date_fin, status, limit, offset } = filters;
      
      let query = 'SELECT * FROM reservations';
      let values = [];
      let conditions = [];

      if (date_debut && date_fin) {
        conditions.push('date_rdv BETWEEN $' + (values.length + 1) + ' AND $' + (values.length + 2));
        values.push(date_debut, date_fin);
      }

      if (status) {
        conditions.push('status = $' + (values.length + 1));
        values.push(status);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY date_rdv, heure_rdv';

      if (limit) {
        query += ' LIMIT $' + (values.length + 1);
        values.push(limit);
      }

      if (offset) {
        query += ' OFFSET $' + (values.length + 1);
        values.push(offset);
      }

      const result = await pool.query(query, values);
      
      return {
        success: true,
        data: result.rows,
        count: result.rows.length
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des réservations'
      };
    }
  }

  // Récupérer les réservations d'une semaine
  static async getWeekReservations(date) {
    try {
      // Calculer le début et la fin de la semaine
      const inputDate = new Date(date);
      const dayOfWeek = inputDate.getDay() || 7; // 0 = dimanche, on veut 7
      
      const startOfWeek = new Date(inputDate);
      startOfWeek.setDate(inputDate.getDate() - dayOfWeek + 1);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const query = `
        SELECT * FROM reservations 
        WHERE date_rdv BETWEEN $1 AND $2 
        ORDER BY date_rdv, heure_rdv
      `;
      
      const values = [
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      ];

      const result = await pool.query(query, values);
      
      return {
        success: true,
        data: result.rows,
        semaine: {
          debut: startOfWeek.toISOString().split('T')[0],
          fin: endOfWeek.toISOString().split('T')[0]
        }
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des réservations de la semaine:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des réservations'
      };
    }
  }

  // Récupérer les réservations d'une date spécifique
  static async getReservationsByDate(date) {
    try {
      const query = `
        SELECT 
          id, prenom, nom, email, telephone,
          type_voiture, marque_voiture, formule, prix,
          date_rdv, heure_rdv, commentaires, status
        FROM reservations 
        WHERE date_rdv = $1 AND status != 'cancelled'
        ORDER BY heure_rdv ASC
      `;
      
      const result = await pool.query(query, [date]);
      
      return {
        success: true,
        data: result.rows
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des réservations par date:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des réservations'
      };
    }
  }

  // Vérifier les conflits de créneaux avec durée des formules
  static async checkTimeSlotConflict(date, heure, typeVoiture, formule, excludeId = null) {
    try {
      // Récupérer la durée de la formule depuis la base
      const formuleQuery = `
        SELECT duree FROM formules_${typeVoiture.replace('-', '_')} 
        WHERE nom = $1
      `;
      
      let durationMinutes = 60; // durée par défaut
      try {
        const formuleResult = await pool.query(formuleQuery, [formule]);
        if (formuleResult.rows.length > 0) {
          const duree = formuleResult.rows[0].duree;
          if (duree) {
            const match = duree.match(/(\d+)h?(\d*)/);
            if (match) {
              const hours = parseInt(match[1]) || 0;
              const minutes = parseInt(match[2]) || 0;
              durationMinutes = hours * 60 + minutes;
            }
          }
        }
      } catch (error) {
        console.warn('Impossible de récupérer la durée de la formule, utilisation de 60 min par défaut');
      }

      // Convertir l'heure en minutes
      const [hours, minutes] = heure.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + durationMinutes;

      // Récupérer toutes les réservations de cette date
      let reservationsQuery = `
        SELECT id, heure_rdv, formule, type_voiture 
        FROM reservations 
        WHERE date_rdv = $1 AND status != 'cancelled'
      `;
      
      const queryParams = [date];
      
      if (excludeId) {
        reservationsQuery += ' AND id != $2';
        queryParams.push(excludeId);
      }
      
      const result = await pool.query(reservationsQuery, queryParams);
      
      // Vérifier les conflits
      for (const reservation of result.rows) {
        const [resHours, resMinutes] = reservation.heure_rdv.split(':').map(Number);
        const resStartMinutes = resHours * 60 + resMinutes;
        
        // Récupérer la durée de la réservation existante
        let resDurationMinutes = 60;
        try {
          const resFormuleQuery = `
            SELECT duree FROM formules_${reservation.type_voiture.replace('-', '_')} 
            WHERE nom = $1
          `;
          const resFormuleResult = await pool.query(resFormuleQuery, [reservation.formule]);
          if (resFormuleResult.rows.length > 0) {
            const duree = resFormuleResult.rows[0].duree;
            if (duree) {
              const match = duree.match(/(\d+)h?(\d*)/);
              if (match) {
                const hours = parseInt(match[1]) || 0;
                const minutes = parseInt(match[2]) || 0;
                resDurationMinutes = hours * 60 + minutes;
              }
            }
          }
        } catch (error) {
          // Ignorer l'erreur et utiliser 60 min par défaut
        }
        
        const resEndMinutes = resStartMinutes + resDurationMinutes;
        
        // Vérifier le chevauchement
        if ((startMinutes < resEndMinutes) && (endMinutes > resStartMinutes)) {
          return {
            success: false,
            conflict: true,
            message: `Conflit détecté avec une réservation existante de ${reservation.heure_rdv} (${reservation.formule})`,
            conflictReservation: reservation
          };
        }
      }
      
      return {
        success: true,
        conflict: false,
        message: 'Aucun conflit détecté'
      };

    } catch (error) {
      console.error('Erreur lors de la vérification des conflits:', error);
      return {
        success: false,
        error: 'Erreur lors de la vérification des conflits'
      };
    }
  }

  // Récupérer une réservation par ID
  static async getReservationById(id) {
    try {
      const query = 'SELECT * FROM reservations WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }

      return {
        success: true,
        data: result.rows[0]
      };

    } catch (error) {
      console.error('Erreur lors de la récupération de la réservation:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération de la réservation'
      };
    }
  }

  // Mettre à jour le statut d'une réservation
  static async updateReservationStatus(id, status) {
    try {
      if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        return {
          success: false,
          error: 'Statut invalide'
        };
      }

      const query = `
        UPDATE reservations 
        SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *
      `;

      const result = await pool.query(query, [status, id]);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Réservation non trouvée'
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

  // Mettre à jour une réservation complète
  static async updateReservation(id, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Construire dynamiquement la requête de mise à jour
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        return {
          success: false,
          error: 'Aucune donnée à mettre à jour'
        };
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE reservations 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }

      return {
        success: true,
        data: result.rows[0],
        message: 'Réservation mise à jour avec succès'
      };

    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la réservation'
      };
    }
  }

  // Supprimer une réservation
  static async deleteReservation(id) {
    try {
      const query = 'DELETE FROM reservations WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }

      return {
        success: true,
        message: 'Réservation supprimée avec succès'
      };

    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression de la réservation'
      };
    }
  }

  // Obtenir les statistiques des réservations
  static async getReservationStats(date_debut, date_fin) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          SUM(prix) as total_revenue
        FROM reservations
        WHERE date_rdv BETWEEN $1 AND $2
      `;

      const result = await pool.query(query, [date_debut, date_fin]);
      
      return {
        success: true,
        data: result.rows[0]
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des statistiques'
      };
    }
  }
}

module.exports = {
  ReservationService,
  createReservationsTable
}; 