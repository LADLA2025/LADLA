// Configuration des URLs d'API selon l'environnement
const getAPIBaseURL = () => {
  // En production, utilise l'URL de ton API déployée
  if (import.meta.env.PROD) {
    // URL de production Render - Backend LADL
    return import.meta.env.VITE_API_URL || 'https://ladl-backend.onrender.com';
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
  
  // Réservations
  RESERVATIONS: '/reservations',
  RESERVATIONS_BY_DATE: '/reservations/date',
  RESERVATIONS_BY_WEEK: '/reservations/semaine',
}; 