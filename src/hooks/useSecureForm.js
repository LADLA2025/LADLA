import { useState, useCallback } from 'react';
import { validateAndSanitizeForm, detectMaliciousInput, VALIDATION_RULES } from '../utils/security';

/**
 * Hook personnalisé pour gérer la sécurité des formulaires
 * @param {string} formType - Type de formulaire (reservation, contact, formule, newsletter)
 * @param {object} initialData - Données initiales du formulaire
 * @returns {object} - Méthodes et état du formulaire sécurisé
 */
export const useSecureForm = (formType, initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [securityWarnings, setSecurityWarnings] = useState([]);

  /**
   * Gère les changements d'input avec sécurité en temps réel
   */
  const handleSecureChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    // Détection d'attaque en temps réel
    if (typeof inputValue === 'string' && detectMaliciousInput(inputValue)) {
      setSecurityWarnings(prev => [
        ...prev.filter(w => w.field !== name),
        {
          field: name,
          message: `Contenu suspect détecté dans le champ ${name}`,
          timestamp: Date.now()
        }
      ]);
      
      // Log de sécurité
      console.warn(`[SÉCURITÉ] Tentative d'attaque détectée dans le champ "${name}":`, inputValue);
      
      // Ne pas mettre à jour la valeur si elle est malicieuse
      return;
    }

    // Supprimer les avertissements pour ce champ si la nouvelle valeur est sûre
    setSecurityWarnings(prev => prev.filter(w => w.field !== name));

    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
  }, []);

  /**
   * Valide et sécurise l'ensemble du formulaire
   */
  const validateForm = useCallback(() => {
    const rules = VALIDATION_RULES[formType];
    if (!rules) {
      console.error(`Règles de validation non trouvées pour le type: ${formType}`);
      return { isValid: false, sanitizedData: {}, errors: ['Configuration de sécurité manquante'] };
    }

    const result = validateAndSanitizeForm(formData, rules);
    
    setErrors(result.errors);
    setIsValid(result.isValid);

    return result;
  }, [formData, formType]);

  /**
   * Soumet le formulaire de manière sécurisée
   */
  const submitSecureForm = useCallback(async (submitFunction) => {
    // Validation et sanitisation
    const { isValid: formIsValid, sanitizedData, errors: validationErrors } = validateForm();
    
    if (!formIsValid) {
      console.warn('[SÉCURITÉ] Tentative de soumission avec des données invalides:', validationErrors);
      return { success: false, errors: validationErrors };
    }

    // Vérification finale de sécurité
    for (const [key, value] of Object.entries(sanitizedData)) {
      if (typeof value === 'string' && detectMaliciousInput(value)) {
        console.error(`[SÉCURITÉ] Contenu malicieux détecté lors de la soumission dans le champ "${key}":`, value);
        return { 
          success: false, 
          errors: [`Contenu non autorisé détecté dans le champ ${key}`] 
        };
      }
    }

    try {
      // Appeler la fonction de soumission avec les données sécurisées
      const result = await submitFunction(sanitizedData);
      
      // Log de succès
      console.log(`[SÉCURITÉ] Formulaire ${formType} soumis avec succès`);
      
      return { success: true, data: result };
    } catch (error) {
      console.error(`[SÉCURITÉ] Erreur lors de la soumission du formulaire ${formType}:`, error);
      return { 
        success: false, 
        errors: ['Erreur lors de la soumission du formulaire'] 
      };
    }
  }, [formData, formType, validateForm]);

  /**
   * Réinitialise le formulaire
   */
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors([]);
    setIsValid(true);
    setSecurityWarnings([]);
  }, [initialData]);

  /**
   * Met à jour les données du formulaire (avec sécurité)
   */
  const setSecureFormData = useCallback((newData) => {
    // Vérifier chaque champ pour des contenus malicieux
    const secureData = {};
    const warnings = [];

    for (const [key, value] of Object.entries(newData)) {
      if (typeof value === 'string' && detectMaliciousInput(value)) {
        warnings.push({
          field: key,
          message: `Contenu suspect dans ${key}`,
          timestamp: Date.now()
        });
        console.warn(`[SÉCURITÉ] Contenu suspect détecté lors de la mise à jour du champ "${key}":`, value);
        secureData[key] = ''; // Vider le champ suspect
      } else {
        secureData[key] = value;
      }
    }

    setFormData(secureData);
    setSecurityWarnings(warnings);
  }, []);

  /**
   * Nettoie les anciens avertissements de sécurité
   */
  const cleanOldWarnings = useCallback(() => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000; // 5 minutes

    setSecurityWarnings(prev => 
      prev.filter(warning => warning.timestamp > fiveMinutesAgo)
    );
  }, []);

  return {
    // État
    formData,
    errors,
    isValid,
    securityWarnings,
    
    // Méthodes
    handleSecureChange,
    validateForm,
    submitSecureForm,
    resetForm,
    setSecureFormData,
    cleanOldWarnings,
    
    // Méthodes utilitaires
    hasSecurityWarnings: securityWarnings.length > 0,
    getFieldErrors: (fieldName) => errors.filter(error => error.includes(fieldName)),
    isFieldValid: (fieldName) => !errors.some(error => error.includes(fieldName))
  };
}; 