// Configuration des URLs d'API selon l'environnement
const getAPIBaseURL = () => {
  // En production, utilise l'URL de ton API déployée
  if (import.meta.env.PROD) {
    // URL de production - Backend LADL temporairement sur Render
    return import.meta.env.VITE_API_URL || 'https://ladla.onrender.com';
  }
  
  // En développement, utilise localhost
  return 'http://localhost:3000';
};

export const API_BASE_URL = getAPIBaseURL();

// Helper pour construire des URLs d'API
export const buildAPIUrl = (endpoint) => {
  return `${API_BASE_URL}/api${endpoint}`;
};

// URLs d'API spécifiques
export const API_ENDPOINTS = {
  // Authentification
  LOGIN: '/admin/login',
  CHANGE_PASSWORD: '/admin/change-password',
  
  // Formules véhicules
  PETITE_CITADINE: '/formules/petite-citadine',
  CITADINE: '/formules/citadine',
  BERLINE: '/formules/berline',
  SUV: '/formules/suv',
  
  // Options de service
  SERVICE_OPTIONS: '/service-options',
  
  // Réservations
  RESERVATIONS: '/reservations',
  RESERVATIONS_BY_DATE: '/reservations/date',
  RESERVATIONS_BY_WEEK: '/reservations/semaine',
  DELETE_RESERVATIONS_BY_MONTH: '/reservations/month',
  
  // Newsletter
  NEWSLETTER: '/newsletter',
  NEWSLETTER_STATS: '/newsletter/stats',
  NEWSLETTER_EXPORT: '/newsletter/export/active',
  
  // Contact
  CONTACT: '/contact',
  CONTACT_STATS: '/contact/stats',
  CONTACT_UNREAD: '/contact/unread',
  CONTACT_BULK_READ: '/contact/bulk/read',
  CONTACT_BULK_DELETE: '/contact/bulk',
}; 