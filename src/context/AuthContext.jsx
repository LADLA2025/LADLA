import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Clés pour le localStorage
const AUTH_STORAGE_KEY = 'ladl_admin_auth';
const AUTH_TIMESTAMP_KEY = 'ladl_admin_auth_timestamp';

// Durée de session en millisecondes (24 heures)
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authStatus = localStorage.getItem(AUTH_STORAGE_KEY);
      const authTimestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
      
      if (authStatus === 'true' && authTimestamp) {
        const timestamp = parseInt(authTimestamp);
        const now = Date.now();
        
        // Vérifier si la session n'a pas expiré
        if (now - timestamp < SESSION_DURATION) {
          setIsAuthenticated(true);
          console.log('🔐 Session admin restaurée depuis le localStorage');
        } else {
          // Session expirée, nettoyer le localStorage
          clearAuthStorage();
          console.log('⏰ Session admin expirée, nettoyage effectué');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de l\'authentification:', error);
      clearAuthStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthStorage = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
  };

  const login = () => {
    try {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      console.log('✅ Session admin créée et sauvegardée');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la session:', error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearAuthStorage();
    console.log('🚪 Session admin fermée et nettoyée');
  };

  // Fonction pour prolonger la session
  const extendSession = () => {
    if (isAuthenticated) {
      try {
        localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
        console.log('🔄 Session admin prolongée');
      } catch (error) {
        console.error('❌ Erreur lors de la prolongation de session:', error);
      }
    }
  };

  // Fonction pour vérifier si la session est proche de l'expiration
  const getSessionTimeRemaining = () => {
    try {
      const authTimestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
      if (authTimestamp) {
        const timestamp = parseInt(authTimestamp);
        const now = Date.now();
        const remaining = SESSION_DURATION - (now - timestamp);
        return Math.max(0, remaining);
      }
    } catch (error) {
      console.error('❌ Erreur lors du calcul du temps de session restant:', error);
    }
    return 0;
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      extendSession,
      getSessionTimeRemaining
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 