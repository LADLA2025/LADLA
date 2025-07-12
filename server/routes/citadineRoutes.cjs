const express = require('express');

function createCitadineRoutes(citadineService) {
  const router = express.Router();

  // GET /api/formules/citadine - Récupérer toutes les formules
  router.get('/', async (req, res) => {
    try {
      const formules = await citadineService.getAllFormules();
      res.json(formules);
    } catch (error) {
      console.error('Erreur GET /api/formules/citadine:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/formules/citadine - Ajouter une nouvelle formule
  router.post('/', async (req, res) => {
    try {
      const formule = await citadineService.addFormule(req.body);
      res.status(201).json(formule);
    } catch (error) {
      console.error('Erreur POST /api/formules/citadine:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // GET /api/formules/citadine/:id - Récupérer une formule par ID
  router.get('/:id', async (req, res) => {
    try {
      const formule = await citadineService.getFormuleById(req.params.id);
      res.json(formule);
    } catch (error) {
      console.error(`Erreur GET /api/formules/citadine/${req.params.id}:`, error);
      res.status(404).json({ error: error.message });
    }
  });

  // PUT /api/formules/citadine/:id - Mettre à jour une formule
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const formuleData = req.body;
      
      // Si on ne met à jour que le prix lavage premium
      if (Object.keys(formuleData).length === 1 && 'lavage_premium_prix' in formuleData) {
        const formule = await citadineService.updateLavagePremiumPrice(id, formuleData.lavage_premium_prix);
        return res.json({
          message: 'Prix lavage premium mis à jour avec succès',
          formule: formule
        });
      }
      
      // Sinon, mise à jour complète
      const formule = await citadineService.updateFormule(id, formuleData);
      res.json(formule);
    } catch (error) {
      console.error(`Erreur PUT /api/formules/citadine/${req.params.id}:`, error);
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/formules/citadine/:id - Supprimer une formule
  router.delete('/:id', async (req, res) => {
    try {
      const formule = await citadineService.deleteFormule(req.params.id);
      res.json({ message: 'Formule supprimée avec succès', formule });
    } catch (error) {
      console.error(`Erreur DELETE /api/formules/citadine/${req.params.id}:`, error);
      res.status(404).json({ error: error.message });
    }
  });

  // GET /api/formules/citadine/stats/count - Obtenir le nombre de formules
  router.get('/stats/count', async (req, res) => {
    try {
      const count = await citadineService.getFormulesCount();
      res.json({ count });
    } catch (error) {
      console.error('Erreur GET /api/formules/citadine/stats/count:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createCitadineRoutes; 