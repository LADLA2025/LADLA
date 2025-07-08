// Utilitaires de sécurité pour protéger l'application contre les attaques XSS, injection SQL, etc.

/**
 * Sanitise une chaîne de caractères pour éviter les attaques XSS
 * @param {string} str - La chaîne à sanitiser
 * @returns {string} - La chaîne sanitisée
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#96;')
    .replace(/=/g, '&#x3D;');
};

/**
 * Sanitise une chaîne pour éviter les injections SQL
 * @param {string} str - La chaîne à sanitiser
 * @returns {string} - La chaîne sanitisée
 */
export const sanitizeSQL = (str) => {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/sp_/gi, '')
    .replace(/union/gi, '')
    .replace(/select/gi, '')
    .replace(/insert/gi, '')
    .replace(/update/gi, '')
    .replace(/delete/gi, '')
    .replace(/drop/gi, '')
    .replace(/create/gi, '')
    .replace(/alter/gi, '')
    .replace(/exec/gi, '')
    .replace(/execute/gi, '');
};

/**
 * Valide un email
 * @param {string} email - L'email à valider
 * @returns {boolean} - True si l'email est valide
 */
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Valide un numéro de téléphone français
 * @param {string} phone - Le numéro à valider
 * @returns {boolean} - True si le numéro est valide
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[-.\s]?\d{2}){4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valide un nom/prénom
 * @param {string} name - Le nom à valider
 * @returns {boolean} - True si le nom est valide
 */
export const validateName = (name) => {
  const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s'-]{2,50}$/;
  return nameRegex.test(name);
};

/**
 * Valide un prix
 * @param {number|string} price - Le prix à valider
 * @returns {boolean} - True si le prix est valide
 */
export const validatePrice = (price) => {
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0 && num <= 10000;
};

/**
 * Valide une adresse
 * @param {string} address - L'adresse à valider
 * @returns {boolean} - True si l'adresse est valide
 */
export const validateAddress = (address) => {
  return typeof address === 'string' && address.trim().length >= 10 && address.length <= 200;
};

/**
 * Valide un commentaire/message
 * @param {string} message - Le message à valider
 * @returns {boolean} - True si le message est valide
 */
export const validateMessage = (message) => {
  return typeof message === 'string' && message.trim().length >= 5 && message.length <= 1000;
};

/**
 * Limite la longueur d'une chaîne
 * @param {string} str - La chaîne à limiter
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - La chaîne limitée
 */
export const limitLength = (str, maxLength) => {
  if (typeof str !== 'string') return '';
  return str.slice(0, maxLength);
};

/**
 * Nettoie et valide un objet de données de formulaire
 * @param {object} data - Les données du formulaire
 * @param {object} rules - Les règles de validation
 * @returns {object} - { isValid: boolean, sanitizedData: object, errors: array }
 */
export const validateAndSanitizeForm = (data, rules) => {
  const sanitizedData = {};
  const errors = [];
  let isValid = true;

  for (const [field, value] of Object.entries(data)) {
    const rule = rules[field];
    if (!rule) continue;

    let sanitizedValue = value;

    // Sanitisation
    if (rule.sanitize) {
      if (rule.type === 'string') {
        sanitizedValue = sanitizeString(value);
      } else if (rule.type === 'sql') {
        sanitizedValue = sanitizeSQL(value);
      }
    }

    // Limitation de longueur
    if (rule.maxLength) {
      sanitizedValue = limitLength(sanitizedValue, rule.maxLength);
    }

    // Validation
    if (rule.required && (!sanitizedValue || sanitizedValue.trim() === '')) {
      errors.push(`Le champ ${rule.label || field} est requis`);
      isValid = false;
    }

    if (sanitizedValue && rule.validate) {
      let isFieldValid = true;
      
      switch (rule.validate) {
        case 'email':
          isFieldValid = validateEmail(sanitizedValue);
          break;
        case 'phone':
          isFieldValid = validatePhone(sanitizedValue);
          break;
        case 'name':
          isFieldValid = validateName(sanitizedValue);
          break;
        case 'price':
          isFieldValid = validatePrice(sanitizedValue);
          break;
        case 'address':
          isFieldValid = validateAddress(sanitizedValue);
          break;
        case 'message':
          isFieldValid = validateMessage(sanitizedValue);
          break;
      }

      if (!isFieldValid) {
        errors.push(`Le champ ${rule.label || field} n'est pas valide`);
        isValid = false;
      }
    }

    sanitizedData[field] = sanitizedValue;
  }

  return { isValid, sanitizedData, errors };
};

/**
 * Détecte les tentatives d'attaque communes (version allégée)
 * @param {string} input - L'entrée à analyser
 * @returns {boolean} - True si une attaque est détectée
 */
export const detectMaliciousInput = (input) => {
  if (typeof input !== 'string') return false;
  
  const maliciousPatterns = [
    // XSS patterns - plus spécifiques
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /javascript:\s*[^;]/gi,
    /on(load|error|click|mouse|key)\s*=/gi,
    
    // SQL injection patterns - plus spécifiques
    /(\bunion\s+all\s+select\b|\bunion\s+select\b.*\bfrom\b)/gi,
    /(\bselect\s+.*\bfrom\b.*\bwhere\b.*['"]\s*or\s+['"]\d+['"]\s*=\s*['"]\d+)/gi,
    /(\bdrop\s+table\b|\bcreate\s+table\b|\balter\s+table\b)/gi,
    /(['"];\s*drop\s+table|['"];\s*delete\s+from|['"];\s*insert\s+into)/gi,
    
    // Command injection patterns - plus spécifiques
    /(\|\s*[a-z]+\s+|\&\&\s*[a-z]+\s+|\;\s*[a-z]+\s+)/gi,
    /(\$\([^)]*\)|\`[^`]*\`)/g,
    
    // Path traversal patterns - plus spécifiques
    /(\.\.[\/\\]){2,}/g,
  ];

  return maliciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Sécurise un objet complet récursivement
 * @param {object} obj - L'objet à sécuriser
 * @returns {object} - L'objet sécurisé
 */
export const secureObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const secured = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Détecter les attaques
      if (detectMaliciousInput(value)) {
        console.warn(`Tentative d'attaque détectée dans le champ: ${key}`);
        secured[key] = '';
      } else {
        secured[key] = sanitizeString(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      secured[key] = secureObject(value);
    } else {
      secured[key] = value;
    }
  }
  
  return secured;
};

/**
 * Règles de validation pour les différents formulaires
 */
export const VALIDATION_RULES = {
  // Formulaire de réservation
  reservation: {
    nom: { type: 'string', required: true, validate: 'name', maxLength: 50, sanitize: true, label: 'Nom' },
    prenom: { type: 'string', required: true, validate: 'name', maxLength: 50, sanitize: true, label: 'Prénom' },
    email: { type: 'string', required: true, validate: 'email', maxLength: 254, sanitize: true, label: 'Email' },
    telephone: { type: 'string', required: true, validate: 'phone', maxLength: 20, sanitize: true, label: 'Téléphone' },
    adresse: { type: 'string', required: true, validate: 'address', maxLength: 200, sanitize: true, label: 'Adresse' },
    commentaires: { type: 'string', required: false, validate: 'message', maxLength: 1000, sanitize: true, label: 'Commentaires' },
    marqueVoiture: { type: 'string', required: true, maxLength: 50, sanitize: true, label: 'Marque de voiture' },
  },
  
  // Formulaire de contact
  contact: {
    nom: { type: 'string', required: true, validate: 'name', maxLength: 50, sanitize: true, label: 'Nom' },
    email: { type: 'string', required: true, validate: 'email', maxLength: 254, sanitize: true, label: 'Email' },
    message: { type: 'string', required: true, validate: 'message', maxLength: 1000, sanitize: true, label: 'Message' },
  },
  
  // Formulaire d'ajout de formule
  formule: {
    nom: { type: 'string', required: true, maxLength: 100, sanitize: true, label: 'Nom de la formule' },
    prix: { type: 'number', required: true, validate: 'price', label: 'Prix' },
    duree: { type: 'string', required: true, maxLength: 50, sanitize: true, label: 'Durée' },
    icone: { type: 'string', required: true, maxLength: 50, sanitize: true, label: 'Icône' },
    services: { type: 'string', required: true, maxLength: 1000, sanitize: true, label: 'Services' },
  },
  
  // Formulaire newsletter
  newsletter: {
    email: { type: 'string', required: true, validate: 'email', maxLength: 254, sanitize: true, label: 'Email' },
    nom: { type: 'string', required: false, validate: 'name', maxLength: 50, sanitize: true, label: 'Nom' },
    prenom: { type: 'string', required: false, validate: 'name', maxLength: 50, sanitize: true, label: 'Prénom' },
  }
}; 