const express = require('express');
const router = express.Router();
const ContactService = require('../contactService.cjs');

// Récupérer tous les messages
router.get('/', async (req, res) => {
  try {
    console.log('💬 Récupération de tous les messages de contact');
    
    const result = await ContactService.getAllMessages();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route GET /contact:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des messages' 
    });
  }
});

// Ajouter un nouveau message
router.post('/', async (req, res) => {
  try {
    const { nom, email, message } = req.body;
    
    console.log('💬 Nouveau message de contact:', { nom, email, message: message?.substring(0, 50) + '...' });
    
    if (!nom || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Nom, email et message requis'
      });
    }
    
    const result = await ContactService.addMessage(nom, email, message);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route POST /contact:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de l\'ajout du message' 
    });
  }
});

// Mettre à jour le statut d'un message
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`💬 Mise à jour du statut du message ${id}:`, status);
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Statut requis'
      });
    }
    
    const result = await ContactService.updateMessageStatus(id, status);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route PUT /contact/:id/status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la mise à jour du statut' 
    });
  }
});

// Supprimer un message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`💬 Suppression du message ${id}`);
    
    const result = await ContactService.deleteMessage(id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route DELETE /contact/:id:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la suppression du message' 
    });
  }
});

// Récupérer les statistiques
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Récupération des statistiques des messages de contact');
    
    const result = await ContactService.getStats();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route GET /contact/stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des statistiques' 
    });
  }
});

// Récupérer les messages non lus
router.get('/unread', async (req, res) => {
  try {
    console.log('📬 Récupération des messages non lus');
    
    const result = await ContactService.getUnreadMessages();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route GET /contact/unread:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des messages non lus' 
    });
  }
});

// Marquer plusieurs messages comme lus
router.put('/bulk/read', async (req, res) => {
  try {
    const { ids } = req.body;
    
    console.log('💬 Marquage multiple comme lu:', ids);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Liste d\'IDs requise'
      });
    }
    
    const result = await ContactService.markMultipleAsRead(ids);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route PUT /contact/bulk/read:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la mise à jour multiple' 
    });
  }
});

// Supprimer plusieurs messages
router.delete('/bulk', async (req, res) => {
  try {
    const { ids } = req.body;
    
    console.log('💬 Suppression multiple:', ids);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Liste d\'IDs requise'
      });
    }
    
    const result = await ContactService.deleteMultipleMessages(ids);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur dans la route DELETE /contact/bulk:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la suppression multiple' 
    });
  }
});

module.exports = router; 