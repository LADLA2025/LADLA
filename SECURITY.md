# 🛡️ Système de Sécurité LADL

## Vue d'ensemble

Ce document décrit le système de sécurité complet implémenté dans l'application LADL pour protéger contre les attaques XSS, injection SQL, CSRF et autres vulnérabilités communes.

## 🔒 Protections Implémentées

### 1. Protection XSS (Cross-Site Scripting)
- **Sanitisation automatique** de tous les inputs utilisateur
- **Détection en temps réel** des tentatives d'injection de scripts
- **Échappement des caractères** dangereux (`<`, `>`, `"`, `'`, etc.)
- **Validation côté client et serveur**

### 2. Protection contre l'Injection SQL
- **Sanitisation des requêtes** avec suppression des mots-clés SQL
- **Validation des paramètres** avant envoi au serveur
- **Logging des tentatives** d'injection

### 3. Protection CSRF (Cross-Site Request Forgery)
- **Validation de l'origine** des requêtes
- **Whitelist des domaines** autorisés
- **Vérification des headers** HTTP

### 4. Rate Limiting
- **Limitation du nombre de requêtes** par IP
- **Protection contre les attaques DDoS**
- **Alertes automatiques** en cas de dépassement

## 📁 Structure du Système

```
src/
├── utils/
│   └── security.js          # Utilitaires de sécurité côté client
├── hooks/
│   └── useSecureForm.js     # Hook pour formulaires sécurisés
├── components/
│   └── SecurityAlert.jsx   # Composants d'alerte de sécurité
└── pages/
    ├── Contact.jsx         # Exemple d'intégration
    └── Panneldecommande/
        ├── Reservation.jsx # Formulaire sécurisé
        └── Login.jsx       # Authentification sécurisée

server/
└── middleware/
    └── security.cjs        # Middleware de sécurité serveur
```

## 🚀 Utilisation

### 1. Sécuriser un Formulaire

```jsx
import { useSecureForm } from '../hooks/useSecureForm';
import SecurityAlert, { ValidationErrors, FormSecurityStatus } from '../components/SecurityAlert';

function MonFormulaire() {
  const {
    formData,
    errors,
    securityWarnings,
    handleSecureChange,
    submitSecureForm,
    hasSecurityWarnings
  } = useSecureForm('contact', {
    nom: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await submitSecureForm(async (sanitizedData) => {
      // Votre logique de soumission avec données sécurisées
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      });
      return response.json();
    });

    if (result.success) {
      // Succès
    } else {
      // Erreur
    }
  };

  return (
    <div>
      <SecurityAlert warnings={securityWarnings} />
      <ValidationErrors errors={errors} />
      <FormSecurityStatus 
        isSecure={!hasSecurityWarnings && errors.length === 0}
        warningsCount={securityWarnings.length}
      />
      
      <form onSubmit={handleSubmit}>
        <input
          name="nom"
          value={formData.nom}
          onChange={handleSecureChange}
        />
        {/* Autres champs... */}
      </form>
    </div>
  );
}
```

### 2. Intégration Côté Serveur

```javascript
const express = require('express');
const { 
  sanitizeInput, 
  validateHeaders, 
  securityLogger, 
  csrfProtection,
  createRateLimit 
} = require('./middleware/security.cjs');

const app = express();

// Appliquer les middlewares de sécurité
app.use(securityLogger);
app.use(createRateLimit(15 * 60 * 1000, 100)); // 100 req/15min
app.use(validateHeaders);
app.use(csrfProtection);
app.use(sanitizeInput);

// Vos routes...
app.post('/api/contact', (req, res) => {
  // req.body est automatiquement sanitisé
  console.log('Données sécurisées:', req.body);
});
```

## 🔍 Types de Validation

### Règles Prédéfinies

Le système inclut des règles de validation pour :

- **Email** : Format RFC valide
- **Téléphone** : Format français (06/07/09 + international)
- **Nom/Prénom** : Caractères alphabétiques + accents
- **Prix** : Nombres positifs (0-10000€)
- **Adresse** : Longueur minimale 10 caractères
- **Message** : Longueur 10-1000 caractères

### Types de Formulaires

- `reservation` : Formulaire de réservation complet
- `contact` : Formulaire de contact simple
- `formule` : Ajout de formules de service
- `newsletter` : Inscription newsletter

## 🚨 Alertes et Monitoring

### Alertes Utilisateur
- **Alertes de sécurité** : Contenu suspect détecté
- **Erreurs de validation** : Champs mal remplis
- **Statut du formulaire** : Indicateur de sécurité global

### Logging Serveur
```
[SÉCURITÉ] 2024-01-15T10:30:00.000Z - POST /api/contact depuis 192.168.1.100
[SÉCURITÉ] Tentative d'attaque détectée dans le champ "message" depuis IP: 192.168.1.100
[INCIDENT SÉCURITÉ] {
  "timestamp": "2024-01-15T10:30:00.000Z",
  "ip": "192.168.1.100",
  "method": "POST",
  "path": "/api/contact",
  "field": "message",
  "suspiciousValue": "<script>alert('xss')</script>"
}
```

## ⚙️ Configuration

### Variables d'Environnement

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Domaines autorisés (CORS)
ALLOWED_ORIGINS=https://lesasdelauto06.fr,https://www.lesasdelauto06.fr

# Logging
SECURITY_LOG_LEVEL=warn
```

### Personnalisation des Règles

```javascript
// Dans src/utils/security.js
export const VALIDATION_RULES = {
  monFormulaire: {
    monChamp: { 
      type: 'string', 
      required: true, 
      validate: 'email', 
      maxLength: 100, 
      sanitize: true, 
      label: 'Mon Champ' 
    }
  }
};
```

## 🔧 Maintenance

### Tests de Sécurité

Pour tester le système :

1. **Test XSS** : Essayer `<script>alert('test')</script>` dans un champ
2. **Test SQL** : Essayer `'; DROP TABLE users; --` 
3. **Test Rate Limit** : Envoyer plus de 100 requêtes en 15 minutes
4. **Test CSRF** : Requête depuis un domaine non autorisé

### Mise à Jour des Patterns

Les patterns de détection sont dans `src/utils/security.js` et `server/middleware/security.cjs`. Ajoutez de nouveaux patterns selon les menaces émergentes.

## 📊 Métriques de Sécurité

Le système génère automatiquement :
- Nombre d'attaques bloquées
- IPs suspectes
- Types d'attaques tentées
- Temps de réponse des validations

## 🆘 En Cas d'Incident

1. **Vérifiez les logs** serveur pour les détails
2. **Bloquez l'IP** si nécessaire
3. **Analysez le pattern** d'attaque
4. **Mettez à jour les règles** si besoin
5. **Notifiez l'équipe** de sécurité

## 📞 Support

En cas de problème de sécurité :
- Consultez les logs avec `[SÉCURITÉ]` et `[INCIDENT SÉCURITÉ]`
- Vérifiez la configuration des domaines autorisés
- Testez les règles de validation
- Contactez l'équipe de développement

---

**⚠️ Important** : Ce système de sécurité est une couche de protection supplémentaire. Il ne remplace pas les bonnes pratiques de sécurité côté serveur et base de données. 