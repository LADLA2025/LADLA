const express = require('express');
const router = express.Router();

function createServiceOptionsRoutes(serviceOptionsService) {
  
  // Route pour récupérer toutes les options pour un type de véhicule
  router.get('/:vehicleType', async (req, res) => {
    try {
      const { vehicleType } = req.params;
      const options = await serviceOptionsService.getOptionsForVehicleType(vehicleType);
      res.json(options);
    } catch (err) {
      console.error('Erreur lors de la récupération des options:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des options' });
    }
  });

  // Route pour récupérer une option spécifique
  router.get('/:vehicleType/:optionName', async (req, res) => {
    try {
      const { vehicleType, optionName } = req.params;
      const option = await serviceOptionsService.getOption(vehicleType, optionName);
      res.json({ [optionName]: option });
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'option:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'option' });
    }
  });

  // Route pour mettre à jour ou créer une option
  router.post('/:vehicleType/:optionName', async (req, res) => {
    try {
      const { vehicleType, optionName } = req.params;
      const { value } = req.body;
      
      if (typeof value !== 'boolean') {
        return res.status(400).json({ error: 'La valeur doit être un booléen' });
      }

      const option = await serviceOptionsService.setOption(vehicleType, optionName, value);
      res.json({
        message: 'Option mise à jour avec succès',
        option
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'option:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'option' });
    }
  });

  // Route pour supprimer une option
  router.delete('/:vehicleType/:optionName', async (req, res) => {
    try {
      const { vehicleType, optionName } = req.params;
      await serviceOptionsService.deleteOption(vehicleType, optionName);
      res.json({ message: 'Option supprimée avec succès' });
    } catch (err) {
      if (err.message === 'Option non trouvée') {
        return res.status(404).json({ error: err.message });
      }
      console.error('Erreur lors de la suppression de l\'option:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'option' });
    }
  });

  // Route pour récupérer toutes les options (admin)
  router.get('/', async (req, res) => {
    try {
      const options = await serviceOptionsService.getAllOptions();
      res.json(options);
    } catch (err) {
      console.error('Erreur lors de la récupération de toutes les options:', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des options' });
    }
  });

  return router;
}

module.exports = createServiceOptionsRoutes; 