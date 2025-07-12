const express = require('express');
const router = express.Router();

function createPetiteCitadineRoutes(petiteCitadineService) {
  
  // Route pour récupérer toutes les formules petite citadine
  router.get('/', async (req, res) => {
    try {
      const formules = await petiteCitadineService.getAllFormules();
      res.json(formules);
    } catch (err) {
      console.error('Erreur lors de la récupération des formules:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des formules' });
    }
  });

  // Route pour récupérer une formule par ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const formule = await petiteCitadineService.getFormuleById(id);
      res.json(formule);
    } catch (err) {
      if (err.message === 'Formule non trouvée') {
        return res.status(404).json({ error: err.message });
      }
      console.error('Erreur lors de la récupération de la formule:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération de la formule' });
    }
  });

  // Route pour ajouter une nouvelle formule petite citadine
  router.post('/', async (req, res) => {
    try {
      const formuleData = req.body;
      const nouvelleFormule = await petiteCitadineService.addFormule(formuleData);
      res.status(201).json({
        message: 'Formule ajoutée avec succès',
        formule: nouvelleFormule
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la formule:', err);
      if (err.message.includes('Tous les champs sont requis')) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Erreur serveur lors de l\'ajout de la formule' });
    }
  });

  // Route pour mettre à jour une formule petite citadine
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const formuleData = req.body;
      
      // Si on ne met à jour que le prix lavage premium
      if (Object.keys(formuleData).length === 1 && 'lavage_premium_prix' in formuleData) {
        const formuleMiseAJour = await petiteCitadineService.updateLavagePremiumPrice(id, formuleData.lavage_premium_prix);
        return res.json({
          message: 'Prix lavage premium mis à jour avec succès',
          formule: formuleMiseAJour
        });
      }
      
      // Sinon, mise à jour complète
      const formuleMiseAJour = await petiteCitadineService.updateFormule(id, formuleData);
      res.json({
        message: 'Formule mise à jour avec succès',
        formule: formuleMiseAJour
      });
    } catch (err) {
      if (err.message === 'Formule non trouvée') {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes('Tous les champs sont requis')) {
        return res.status(400).json({ error: err.message });
      }
      console.error('Erreur lors de la mise à jour de la formule:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la formule' });
    }
  });

  // Route pour supprimer une formule petite citadine
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await petiteCitadineService.deleteFormule(id);
      res.json({ message: 'Formule supprimée avec succès' });
    } catch (err) {
      if (err.message === 'Formule non trouvée') {
        return res.status(404).json({ error: err.message });
      }
      console.error('Erreur lors de la suppression de la formule:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression de la formule' });
    }
  });

  // Route pour obtenir le nombre total de formules
  router.get('/stats/count', async (req, res) => {
    try {
      const count = await petiteCitadineService.getFormulesCount();
      res.json({ count });
    } catch (err) {
      console.error('Erreur lors du comptage des formules:', err);
      res.status(500).json({ error: 'Erreur serveur lors du comptage des formules' });
    }
  });

  return router;
}

module.exports = createPetiteCitadineRoutes; 