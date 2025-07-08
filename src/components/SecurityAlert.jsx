import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Composant d'alerte de sécurité
 * @param {array} warnings - Liste des avertissements de sécurité
 * @param {function} onDismiss - Fonction pour fermer une alerte
 * @param {string} className - Classes CSS additionnelles
 */
const SecurityAlert = ({ warnings = [], onDismiss, className = '' }) => {
  if (!warnings.length) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence>
        {warnings.map((warning, index) => (
          <motion.div
            key={`${warning.field}-${warning.timestamp}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <i className="bx bx-shield-x text-red-400 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    🚨 Alerte de sécurité
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {warning.message}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Votre saisie a été bloquée pour des raisons de sécurité.
                  </p>
                </div>
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(warning.field)}
                  className="flex-shrink-0 ml-4 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Fermer l'alerte"
                >
                  <i className="bx bx-x text-lg"></i>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Composant d'alerte d'erreurs de validation
 * @param {array} errors - Liste des erreurs de validation
 * @param {string} className - Classes CSS additionnelles
 */
export const ValidationErrors = ({ errors = [], className = '' }) => {
  if (!errors.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg shadow-sm ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <i className="bx bx-error text-orange-400 text-xl"></i>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-orange-800">
            ⚠️ Erreurs de validation
          </h3>
          <ul className="text-sm text-orange-700 mt-2 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-#CC0000 mt-0.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Composant d'indicateur de sécurité pour les champs
 * @param {boolean} isSecure - Si le champ est sécurisé
 * @param {string} fieldName - Nom du champ
 */
export const SecurityIndicator = ({ isSecure = true, fieldName = '' }) => {
  if (isSecure) {
    return (
      <div className="flex items-center space-x-1 text-green-600 text-xs mt-1">
        <i className="bx bx-shield-check"></i>
        <span>Sécurisé</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-red-600 text-xs mt-1">
      <i className="bx bx-shield-x"></i>
      <span>Contenu suspect détecté</span>
    </div>
  );
};

/**
 * Composant de statut de sécurité global du formulaire
 * @param {boolean} isSecure - Si le formulaire est sécurisé
 * @param {number} warningsCount - Nombre d'avertissements
 */
export const FormSecurityStatus = ({ isSecure = true, warningsCount = 0 }) => {
  if (isSecure && warningsCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
      >
        <i className="bx bx-shield-check text-lg"></i>
        <span className="text-sm font-medium">Formulaire sécurisé</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
    >
      <i className="bx bx-shield-x text-lg"></i>
      <span className="text-sm font-medium">
        {warningsCount} problème{warningsCount > 1 ? 's' : ''} de sécurité détecté{warningsCount > 1 ? 's' : ''}
      </span>
    </motion.div>
  );
};

export default SecurityAlert; 
