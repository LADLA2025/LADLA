// Middleware de sécurité pour le serveur Node.js
const rateLimit = require('express-rate-limit');

/**
 * Sanitise une chaîne de caractères côté serveur
 */
const sanitizeString = (str) => {
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
 * Détecte les tentatives d'attaque communes
 */
const detectMaliciousInput = (input) => {
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
 * Middleware de limitation de taux (Rate Limiting)
 */
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: 'Trop de requêtes. Veuillez réessayer plus tard.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.warn(`[SÉCURITÉ] Rate limit dépassé pour IP: ${req.ip}, Path: ${req.path}`);
      res.status(429).json({
        success: false,
        error: 'Trop de requêtes. Veuillez réessayer plus tard.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
  });
};

/**
 * Middleware de validation et sanitisation des données
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Fonction récursive pour sanitiser un objet
    const sanitizeObject = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const sanitized = {};
      
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          // Détecter les attaques
          if (detectMaliciousInput(value)) {
            console.warn(`[SÉCURITÉ] Tentative d'attaque détectée dans le champ "${key}" depuis IP: ${req.ip}`);
            console.warn(`[SÉCURITÉ] Contenu suspect: ${value}`);
            
            // Enregistrer l'incident
            logSecurityIncident(req, key, value);
            
            return res.status(400).json({
              success: false,
              error: `Contenu non autorisé détecté dans le champ ${key}`,
              code: 'MALICIOUS_INPUT_DETECTED'
            });
          }
          
          sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    };

    // Sanitiser le body de la requête
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitiser les paramètres de requête
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    // Sanitiser les paramètres de route
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    console.error('[SÉCURITÉ] Erreur lors de la sanitisation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur de traitement des données',
      code: 'SANITIZATION_ERROR'
    });
  }
};

/**
 * Middleware de validation des headers
 */
const validateHeaders = (req, res, next) => {
  const suspiciousHeaders = [
    'x-forwarded-host',
    'x-real-ip',
    'x-cluster-client-ip'
  ];

  for (const header of suspiciousHeaders) {
    if (req.headers[header]) {
      const value = req.headers[header];
      if (detectMaliciousInput(value)) {
        console.warn(`[SÉCURITÉ] Header suspect détecté: ${header} = ${value} depuis IP: ${req.ip}`);
        return res.status(400).json({
          success: false,
          error: 'Headers non autorisés',
          code: 'MALICIOUS_HEADERS'
        });
      }
    }
  }

  next();
};

/**
 * Middleware de logging de sécurité
 */
const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log de la requête
  console.log(`[SÉCURITÉ] ${new Date().toISOString()} - ${req.method} ${req.path} depuis ${req.ip}`);
  
  // Intercepter la réponse pour logger les erreurs
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    if (res.statusCode >= 400) {
      console.warn(`[SÉCURITÉ] Réponse d'erreur ${res.statusCode} pour ${req.method} ${req.path} (${responseTime}ms)`);
    }
    
    originalSend.call(this, data);
  };

  next();
};

/**
 * Enregistre un incident de sécurité
 */
const logSecurityIncident = (req, field, value) => {
  const incident = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    method: req.method,
    path: req.path,
    field: field,
    suspiciousValue: value.substring(0, 100), // Limiter la longueur
    headers: {
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'referer': req.headers['referer']
    }
  };

  // En production, vous pourriez vouloir enregistrer cela dans une base de données
  console.error('[INCIDENT SÉCURITÉ]', JSON.stringify(incident, null, 2));
  
  // Optionnel: Envoyer une alerte email ou notification
  // sendSecurityAlert(incident);
};

/**
 * Middleware de protection CSRF simple
 */
const csrfProtection = (req, res, next) => {
  // Pour les requêtes POST, PUT, DELETE, vérifier l'origine
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const origin = req.headers.origin || req.headers.referer;
    
    if (!origin) {
      console.warn(`[SÉCURITÉ] Requête sans origine depuis IP: ${req.ip}`);
      return res.status(403).json({
        success: false,
        error: 'Origine de la requête non autorisée',
        code: 'MISSING_ORIGIN'
      });
    }

    // Vérifier que l'origine est autorisée (à adapter selon vos domaines)
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://lesasdelauto06.fr',
      'https://www.lesasdelauto06.fr'
    ];

    const originUrl = new URL(origin);
    const isAllowed = allowedOrigins.some(allowed => {
      const allowedUrl = new URL(allowed);
      return allowedUrl.origin === originUrl.origin;
    });

    if (!isAllowed) {
      console.warn(`[SÉCURITÉ] Origine non autorisée: ${origin} depuis IP: ${req.ip}`);
      return res.status(403).json({
        success: false,
        error: 'Origine de la requête non autorisée',
        code: 'UNAUTHORIZED_ORIGIN'
      });
    }
  }

  next();
};

module.exports = {
  sanitizeString,
  detectMaliciousInput,
  sanitizeInput,
  validateHeaders,
  securityLogger,
  csrfProtection,
  createRateLimit,
  logSecurityIncident
}; 