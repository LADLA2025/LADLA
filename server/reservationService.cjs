const { Pool } = require('pg');
// Service de réservation - backend uniquement

// Configuration de la base de données (utilise la même config que le serveur principal)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.mmzywkqwiwdrdtkocrtj:Edward2002%40%40@aws-0-eu-west-3.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
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
        options JSONB, -- Options supplémentaires sélectionnées
        
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
      console.log('🔍 ReservationService.createReservation appelé avec:', reservationData);
      
      const {
        prenom, nom, email, telephone, adresse,
        typeVoiture, marqueVoiture, formule, prix,
        date, heure, commentaires, newsletter, options
      } = reservationData;

      // Vérifier les conflits de créneaux avant de créer la réservation
      const conflictCheck = await ReservationService.checkTimeSlotConflict(
        date, heure, typeVoiture, formule
      );

      if (!conflictCheck.success) {
        console.error('Erreur vérification conflit:', conflictCheck.error);
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
          date_rdv, heure_rdv, commentaires, newsletter, options, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;

      const values = [
        prenom, nom, email, telephone, adresse,
        typeVoiture, marqueVoiture, formule, prix || 0,
        date, heure, commentaires || '', newsletter || false, 
        options ? JSON.stringify(options) : null, 'pending'
      ];

      const result = await pool.query(query, values);
      
      console.log('✅ Réservation créée avec succès, ID:', result.rows[0].id);
        
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
      const inputDate = new Date(date + 'T12:00:00'); // Forcer UTC à midi pour éviter les problèmes de timezone
      const dayOfWeek = inputDate.getDay(); // 0 = dimanche, 1 = lundi, etc.
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Distance du lundi
      
      const startOfWeek = new Date(inputDate);
      startOfWeek.setDate(inputDate.getDate() - daysFromMonday);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const query = `
        SELECT 
          id, prenom, nom, email, telephone, adresse,
          type_voiture, marque_voiture, formule, prix,
          date_rdv::text as date_rdv, heure_rdv::text as heure_rdv,
          commentaires, newsletter, options, status,
          created_at, updated_at
        FROM reservations 
        WHERE date_rdv BETWEEN $1 AND $2 
        AND status != 'cancelled'
        ORDER BY date_rdv, heure_rdv
      `;
      
      // Utiliser la date locale pour éviter les problèmes de timezone
      const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const values = [
        formatLocalDate(startOfWeek),
        formatLocalDate(endOfWeek)
      ];

      console.log(`📅 Recherche réservations entre ${values[0]} et ${values[1]}`);

      const result = await pool.query(query, values);
      
      console.log(`📋 ${result.rows.length} réservations trouvées pour la semaine`);
      if (result.rows.length > 0) {
        console.log('📋 Détails des réservations:', result.rows.map(r => `${r.prenom} ${r.nom} - ${r.date_rdv} à ${r.heure_rdv}`));
      }
      
      return {
        success: true,
        data: result.rows,
        semaine: {
          debut: formatLocalDate(startOfWeek),
          fin: formatLocalDate(endOfWeek)
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
          date_rdv::text as date_rdv, heure_rdv::text as heure_rdv, 
          commentaires, status, options
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
      // Durée par défaut
      let durationMinutes = 60; 
      
      // Récupérer la durée de la formule depuis la base avec gestion d'erreur améliorée
      try {
        // Mapping des types de voitures vers les noms de tables
        const tableMapping = {
          'petite-citadine': 'formules_petite_citadine',
          'citadine': 'formules_citadine',
          'berline': 'formules_berline',
          'suv': 'formules_suv'
        };

        const tableName = tableMapping[typeVoiture] || 'formules_citadine';
        
        // Vérifier d'abord si la table existe
        const tableExistsQuery = `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `;
        const tableExistsResult = await pool.query(tableExistsQuery, [tableName]);
        
        if (tableExistsResult.rows[0].exists) {
          const formuleQuery = `SELECT duree FROM ${tableName} WHERE nom = $1`;
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
        } else {
          console.warn(`Table ${tableName} n'existe pas, utilisation de 60 min par défaut`);
        }
      } catch (error) {
        console.warn('Impossible de récupérer la durée de la formule:', error.message);
        console.warn('Utilisation de 60 min par défaut');
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
          const resTableMapping = {
            'petite-citadine': 'formules_petite_citadine',
            'citadine': 'formules_citadine',
            'berline': 'formules_berline',
            'suv': 'formules_suv'
          };

          const resTableName = resTableMapping[reservation.type_voiture] || 'formules_citadine';
          
          // Vérifier si la table existe
          const resTableExistsQuery = `
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = $1
            );
          `;
          const resTableExistsResult = await pool.query(resTableExistsQuery, [resTableName]);
          
          if (resTableExistsResult.rows[0].exists) {
            const resFormuleQuery = `SELECT duree FROM ${resTableName} WHERE nom = $1`;
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
          }
        } catch (error) {
          console.warn('Erreur récupération durée réservation existante:', error.message);
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

  // Supprimer toutes les réservations d'un mois spécifique
  static async deleteReservationsByMonth(year, month) {
    try {
      // Valider les paramètres
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      
      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return {
          success: false,
          error: 'Année ou mois invalide'
        };
      }

      // Calculer le premier et dernier jour du mois
      const firstDay = new Date(yearNum, monthNum - 1, 1);
      const lastDay = new Date(yearNum, monthNum, 0);
      
      const firstDayStr = firstDay.toISOString().split('T')[0];
      const lastDayStr = lastDay.toISOString().split('T')[0];

      // Compter d'abord les réservations à supprimer
      const countQuery = `
        SELECT COUNT(*) as count 
        FROM reservations 
        WHERE date_rdv BETWEEN $1 AND $2
      `;
      
      const countResult = await pool.query(countQuery, [firstDayStr, lastDayStr]);
      const reservationsCount = parseInt(countResult.rows[0].count);

      if (reservationsCount === 0) {
        return {
          success: true,
          deletedCount: 0,
          message: 'Aucune réservation trouvée pour ce mois'
        };
      }

      // Supprimer toutes les réservations du mois
      const deleteQuery = `
        DELETE FROM reservations 
        WHERE date_rdv BETWEEN $1 AND $2
        RETURNING id, prenom, nom, date_rdv
      `;
      
      const deleteResult = await pool.query(deleteQuery, [firstDayStr, lastDayStr]);
      
      console.log(`🗑️ Suppression de ${deleteResult.rows.length} réservations pour ${monthNum}/${yearNum}`);
      
      return {
        success: true,
        deletedCount: deleteResult.rows.length,
        deletedReservations: deleteResult.rows,
        message: `${deleteResult.rows.length} réservation(s) supprimée(s) pour ${monthNum}/${yearNum}`,
        period: {
          year: yearNum,
          month: monthNum,
          firstDay: firstDayStr,
          lastDay: lastDayStr
        }
      };

    } catch (error) {
      console.error('Erreur lors de la suppression des réservations par mois:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression des réservations'
      };
    }
  }
}

module.exports = {
  ReservationService,
  createReservationsTable
}; 