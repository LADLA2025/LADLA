const express = require('express');

function createSuvRoutes(suvService) {
  const router = express.Router();

  // GET /api/formules/suv - Récupérer toutes les formules
  router.get('/', async (req, res) => {
    try {
      const formules = await suvService.getAllFormules();
      res.json(formules);
    } catch (error) {
      console.error('Erreur GET /api/formules/suv:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/formules/suv - Ajouter une nouvelle formule
  router.post('/', async (req, res) => {
    try {
      const formule = await suvService.addFormule(req.body);
      res.status(201).json(formule);
    } catch (error) {
      console.error('Erreur POST /api/formules/suv:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // GET /api/formules/suv/:id - Récupérer une formule par ID
  router.get('/:id', async (req, res) => {
    try {
      const formule = await suvService.getFormuleById(req.params.id);
      res.json(formule);
    } catch (error) {
      console.error(`Erreur GET /api/formules/suv/${req.params.id}:`, error);
      res.status(404).json({ error: error.message });
    }
  });

  // PUT /api/formules/suv/:id - Mettre à jour une formule
  router.put('/:id', async (req, res) => {
    try {
      // Vérifier si c'est une mise à jour uniquement du prix du lavage premium
      const isLavagePremiumPriceUpdate = Object.keys(req.body).length === 1 && 
                                         req.body.hasOwnProperty('lavage_premium_prix');
      
      let formule;
      if (isLavagePremiumPriceUpdate) {
        // Utiliser la méthode spécialisée pour mettre à jour uniquement le prix du lavage premium
        formule = await suvService.updateLavagePremiumPrice(req.params.id, req.body.lavage_premium_prix);
      } else {
        // Utiliser la méthode normale pour mettre à jour tous les champs
        formule = await suvService.updateFormule(req.params.id, req.body);
      }
      
      res.json(formule);
    } catch (error) {
      console.error(`Erreur PUT /api/formules/suv/${req.params.id}:`, error);
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/formules/suv/:id - Supprimer une formule
  router.delete('/:id', async (req, res) => {
    try {
      const formule = await suvService.deleteFormule(req.params.id);
      res.json({ message: 'Formule supprimée avec succès', formule });
    } catch (error) {
      console.error(`Erreur DELETE /api/formules/suv/${req.params.id}:`, error);
      res.status(404).json({ error: error.message });
    }
  });

  // GET /api/formules/suv/stats/count - Obtenir le nombre de formules
  router.get('/stats/count', async (req, res) => {
    try {
      const count = await suvService.getFormulesCount();
      res.json({ count });
    } catch (error) {
      console.error('Erreur GET /api/formules/suv/stats/count:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createSuvRoutes; 