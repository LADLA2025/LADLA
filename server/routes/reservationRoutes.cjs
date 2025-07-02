const express = require('express');
const { ReservationService } = require('../reservationService.cjs');

const router = express.Router();

// Créer une nouvelle réservation
router.post('/', async (req, res) => {
  try {
    const {
      prenom, nom, email, telephone, adresse,
      typeVoiture, marqueVoiture, formule, prix,
      date, heure, commentaires, newsletter
    } = req.body;

    // Validation des données requises
    if (!prenom || !nom || !email || !telephone || !adresse || 
        !typeVoiture || !marqueVoiture || !formule || !date || !heure) {
      return res.status(400).json({ 
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis' 
      });
    }

    const result = await ReservationService.createReservation({
      prenom, nom, email, telephone, adresse,
      typeVoiture, marqueVoiture, formule, prix,
      date, heure, commentaires, newsletter
    });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route POST /reservations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la création de la réservation' 
    });
  }
});

// Récupérer toutes les réservations avec filtres
router.get('/', async (req, res) => {
  try {
    const { date_debut, date_fin, status, limit, offset } = req.query;
    
    const filters = {};
    if (date_debut) filters.date_debut = date_debut;
    if (date_fin) filters.date_fin = date_fin;
    if (status) filters.status = status;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    const result = await ReservationService.getAllReservations(filters);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route GET /reservations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des réservations' 
    });
  }
});

// Récupérer les réservations d'une semaine spécifique
router.get('/semaine/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Valider le format de la date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    const result = await ReservationService.getWeekReservations(date);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route GET /reservations/semaine:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des réservations' 
    });
  }
});

// Récupérer les réservations d'une date spécifique
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Valider le format de la date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    const result = await ReservationService.getReservationsByDate(date);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route GET /reservations/date:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des réservations' 
    });
  }
});

// Récupérer une réservation par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de réservation invalide'
      });
    }

    const result = await ReservationService.getReservationById(parseInt(id));

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route GET /reservations/:id:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération de la réservation' 
    });
  }
});

// Mettre à jour le statut d'une réservation
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de réservation invalide'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Le statut est requis'
      });
    }

    const result = await ReservationService.updateReservationStatus(parseInt(id), status);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route PUT /reservations/:id/status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la mise à jour du statut' 
    });
  }
});

// Mettre à jour une réservation complète
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de réservation invalide'
      });
    }

    // Nettoyer les données de mise à jour (supprimer les champs non autorisés)
    const allowedFields = [
      'prenom', 'nom', 'email', 'telephone', 'adresse',
      'type_voiture', 'marque_voiture', 'formule', 'prix',
      'date_rdv', 'heure_rdv', 'commentaires', 'newsletter', 'status'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    });

    const result = await ReservationService.updateReservation(parseInt(id), filteredData);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route PUT /reservations/:id:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la mise à jour de la réservation' 
    });
  }
});

// Supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de réservation invalide'
      });
    }

    const result = await ReservationService.deleteReservation(parseInt(id));

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route DELETE /reservations/:id:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la suppression de la réservation' 
    });
  }
});

// Obtenir les statistiques des réservations
router.get('/stats/periode', async (req, res) => {
  try {
    const { date_debut, date_fin } = req.query;

    if (!date_debut || !date_fin) {
      return res.status(400).json({
        success: false,
        error: 'Les paramètres date_debut et date_fin sont requis'
      });
    }

    const result = await ReservationService.getReservationStats(date_debut, date_fin);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Erreur dans la route GET /reservations/stats/periode:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des statistiques' 
    });
  }
});

module.exports = router; 