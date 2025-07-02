const express = require('express');

function createBerlineRoutes(berlineService) {
  const router = express.Router();

  // GET /api/formules/berline - Récupérer toutes les formules
  router.get('/', async (req, res) => {
    try {
      const formules = await berlineService.getAllFormules();
      res.json(formules);
    } catch (error) {
      console.error('Erreur GET /api/formules/berline:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/formules/berline - Ajouter une nouvelle formule
  router.post('/', async (req, res) => {
    try {
      const formule = await berlineService.addFormule(req.body);
      res.status(201).json(formule);
    } catch (error) {
      console.error('Erreur POST /api/formules/berline:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // GET /api/formules/berline/:id - Récupérer une formule par ID
  router.get('/:id', async (req, res) => {
    try {
      const formule = await berlineService.getFormuleById(req.params.id);
      res.json(formule);
    } catch (error) {
      console.error(`Erreur GET /api/formules/berline/${req.params.id}:`, error);
      res.status(404).json({ error: error.message });
    }
  });

  // PUT /api/formules/berline/:id - Mettre à jour une formule
  router.put('/:id', async (req, res) => {
    try {
      const formule = await berlineService.updateFormule(req.params.id, req.body);
      res.json(formule);
    } catch (error) {
      console.error(`Erreur PUT /api/formules/berline/${req.params.id}:`, error);
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/formules/berline/:id - Supprimer une formule
  router.delete('/:id', async (req, res) => {
    try {
      const formule = await berlineService.deleteFormule(req.params.id);
      res.json({ message: 'Formule supprimée avec succès', formule });
    } catch (error) {
      console.error(`Erreur DELETE /api/formules/berline/${req.params.id}:`, error);
      res.status(404).json({ error: error.message });
    }
  });

  // GET /api/formules/berline/stats/count - Obtenir le nombre de formules
  router.get('/stats/count', async (req, res) => {
    try {
      const count = await berlineService.getFormulesCount();
      res.json({ count });
    } catch (error) {
      console.error('Erreur GET /api/formules/berline/stats/count:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createBerlineRoutes; 