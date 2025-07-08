import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SessionRestoreNotification = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Vérifier si la session a été restaurée depuis le localStorage
    const checkSessionRestore = () => {
      const authStatus = localStorage.getItem('ladl_admin_auth');
      const authTimestamp = localStorage.getItem('ladl_admin_auth_timestamp');
      const notificationShown = sessionStorage.getItem('session_restore_notification_shown');
      
      if (authStatus === 'true' && authTimestamp && !notificationShown) {
        const timestamp = parseInt(authTimestamp);
        const now = Date.now();
        const sessionAge = now - timestamp;
        
        // Si la session a plus de 5 minutes, c'est probablement une restauration
        if (sessionAge > 5 * 60 * 1000) {
          setShowNotification(true);
          sessionStorage.setItem('session_restore_notification_shown', 'true');
          
          // Masquer automatiquement après 5 secondes
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        }
      }
    };

    // Vérifier après un court délai pour laisser le temps à l'auth de se charger
    const timer = setTimeout(checkSessionRestore, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatSessionAge = (timestamp) => {
    const now = Date.now();
    const age = now - parseInt(timestamp);
    const hours = Math.floor(age / (60 * 60 * 1000));
    const minutes = Math.floor((age % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getSessionTimestamp = () => {
    const authTimestamp = localStorage.getItem('ladl_admin_auth_timestamp');
    return authTimestamp ? formatSessionAge(authTimestamp) : '';
  };

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.3 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF0000] to-#CC0000 px-4 py-2">
              <div className="flex items-center gap-2">
                <i className="bx bx-check-circle text-white text-lg"></i>
                <h3 className="text-white font-medium">Session restaurée</h3>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-700 text-sm mb-2">
                Bienvenue ! Votre session d'administration a été automatiquement restaurée.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <i className="bx bx-time"></i>
                <span>Session active depuis {getSessionTimestamp()}</span>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-2 flex justify-end">
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
              >
                <i className="bx bx-x"></i>
                Fermer
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionRestoreNotification; 
