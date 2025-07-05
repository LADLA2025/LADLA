import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SessionInfo = () => {
  const { getSessionTimeRemaining, extendSession } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showExtendDialog, setShowExtendDialog] = useState(false);

  useEffect(() => {
    // Mettre à jour le temps restant toutes les minutes
    const updateTimer = () => {
      const remaining = getSessionTimeRemaining();
      setTimeRemaining(remaining);
      
      // Afficher le dialog d'extension si moins de 30 minutes restantes
      if (remaining > 0 && remaining < 30 * 60 * 1000 && !showExtendDialog) {
        setShowExtendDialog(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Toutes les minutes

    return () => clearInterval(interval);
  }, [getSessionTimeRemaining, showExtendDialog]);

  // Formater le temps restant
  const formatTimeRemaining = (milliseconds) => {
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  // Obtenir la couleur selon le temps restant
  const getTimeColor = () => {
    const hoursRemaining = timeRemaining / (60 * 60 * 1000);
    if (hoursRemaining < 0.5) return 'text-red-600'; // Moins de 30 min
    if (hoursRemaining < 2) return 'text-orange-600'; // Moins de 2h
    return 'text-green-600'; // Plus de 2h
  };

  const handleExtendSession = () => {
    extendSession();
    setShowExtendDialog(false);
    setTimeRemaining(24 * 60 * 60 * 1000); // 24 heures
  };

  if (timeRemaining <= 0) return null;

  return (
    <>
      {/* Indicateur de session dans la barre latérale */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Session active</p>
            <p className={`text-xs ${getTimeColor()}`}>
              Expire dans {formatTimeRemaining(timeRemaining)}
            </p>
          </div>
          <button
            onClick={() => setShowExtendDialog(true)}
            className="text-[#FFA600] hover:text-orange-600 text-sm"
            title="Prolonger la session"
          >
            <i className="bx bx-refresh"></i>
          </button>
        </div>
      </div>

      {/* Dialog d'extension de session */}
      {showExtendDialog && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="bx bx-time text-orange-600 text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Session bientôt expirée</h3>
                  <p className="text-sm text-gray-600">Votre session expire dans {formatTimeRemaining(timeRemaining)}</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-800">
                  <i className="bx bx-info-circle mr-2"></i>
                  Votre session d'administration va bientôt expirer. Souhaitez-vous la prolonger de 24 heures ?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExtendDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Plus tard
                </button>
                <button
                  onClick={handleExtendSession}
                  className="flex-1 px-4 py-2 bg-[#FFA600] text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="bx bx-refresh"></i>
                  Prolonger
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SessionInfo; 