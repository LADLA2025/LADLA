import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

// Événements qui indiquent une activité utilisateur
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove', 
  'keypress',
  'scroll',
  'touchstart',
  'click'
];

// Délai d'inactivité avant de prolonger la session (5 minutes)
const ACTIVITY_THRESHOLD = 5 * 60 * 1000;

const useSessionActivity = () => {
  const { isAuthenticated, extendSession } = useAuth();

  // Fonction pour gérer l'activité utilisateur
  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      // Utiliser un throttle pour éviter trop d'appels
      if (!handleActivity.lastCall || Date.now() - handleActivity.lastCall > ACTIVITY_THRESHOLD) {
        extendSession();
        handleActivity.lastCall = Date.now();
      }
    }
  }, [isAuthenticated, extendSession]);

  useEffect(() => {
    if (isAuthenticated) {
      // Ajouter les écouteurs d'événements
      ACTIVITY_EVENTS.forEach(event => {
        document.addEventListener(event, handleActivity, { passive: true });
      });

      // Nettoyer les écouteurs lors du démontage
      return () => {
        ACTIVITY_EVENTS.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [isAuthenticated, handleActivity]);

  return null;
};

export default useSessionActivity; 