const express = require('express');
const router = express.Router();
const NewsletterService = require('../newsletterService.cjs');

// Récupérer tous les abonnés
router.get('/', async (req, res) => {
  try {
    console.log('📧 Récupération de tous les abonnés à la newsletter');
    
    const result = await NewsletterService.getAllSubscribers();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route GET /newsletter:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des abonnés' 
    });
  }
});

// Ajouter un nouvel abonné
router.post('/', async (req, res) => {
  try {
    const { email, nom, prenom, source } = req.body;
    
    console.log('📧 Ajout d\'un nouvel abonné:', { email, nom, prenom, source });
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email requis'
      });
    }
    
    const result = await NewsletterService.addSubscriber(email, nom, prenom, source);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route POST /newsletter:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de l\'ajout de l\'abonné' 
    });
  }
});

// Mettre à jour le statut d'un abonné
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📧 Mise à jour du statut de l'abonné ${id}:`, status);
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Statut requis'
      });
    }
    
    const result = await NewsletterService.updateSubscriberStatus(id, status);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route PUT /newsletter/:id/status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la mise à jour du statut' 
    });
  }
});

// Supprimer un abonné
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📧 Suppression de l'abonné ${id}`);
    
    const result = await NewsletterService.deleteSubscriber(id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route DELETE /newsletter/:id:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la suppression de l\'abonné' 
    });
  }
});

// Récupérer les statistiques
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Récupération des statistiques de la newsletter');
    
    const result = await NewsletterService.getStats();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route GET /newsletter/stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des statistiques' 
    });
  }
});

// Exporter les abonnés actifs
router.get('/export/active', async (req, res) => {
  try {
    console.log('📥 Export des abonnés actifs');
    
    const result = await NewsletterService.getActiveSubscribers();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route GET /newsletter/export/active:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de l\'export des abonnés actifs' 
    });
  }
});

module.exports = router; 