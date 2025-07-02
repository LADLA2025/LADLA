import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Vérifier si l'utilisateur a déjà fait son choix
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Délai pour l'affichage de la bannière (UX)
      setTimeout(() => setShowBanner(true), 2000);
    } else {
      const savedPreferences = JSON.parse(consent);
      setCookiePreferences(savedPreferences);
    }
  }, []);

  // Sauvegarder les préférences
  const savePreferences = (preferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
      necessary: true // Toujours activé
    }));
    setCookiePreferences(preferences);
    setShowBanner(false);
    setShowPreferences(false);
    
    // Optionnel : déclencher des événements pour Google Analytics, etc.
    if (preferences.analytics) {
      console.log('Analytics cookies acceptés');
      // Initialiser Google Analytics ici
    }
    if (preferences.marketing) {
      console.log('Marketing cookies acceptés');
      // Initialiser pixels de tracking ici
    }
  };

  // Accepter tous les cookies
  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    savePreferences(allAccepted);
  };

  // Refuser les cookies optionnels
  const rejectOptionalCookies = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    savePreferences(onlyNecessary);
  };

  // Gérer les changements de préférences
  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Ne peut pas être désactivé
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Animation variants
  const bannerVariants = {
    hidden: { 
      y: 100, 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      y: 100, 
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 50
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      {/* Bannière principale */}
      <AnimatePresence>
        {showBanner && !showPreferences && (
          <motion.div
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-auto lg:right-6 lg:max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header avec icône */}
              <div className="bg-gradient-to-r from-[#FFA600] to-orange-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <i className="bx bx-cookie text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Gestion des Cookies</h3>
                    <p className="text-sm opacity-90">Respectons votre vie privée</p>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                  Certains sont essentiels au fonctionnement, d'autres nous aident à comprendre 
                  comment vous utilisez notre site et à vous proposer du contenu personnalisé.
                </p>

                {/* Boutons d'action */}
                <div className="space-y-3">
                  {/* Bouton principal - Accepter */}
                  <motion.button
                    onClick={acceptAllCookies}
                    className="w-full py-3 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white font-semibold rounded-xl hover:from-[#FF9500] hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="bx bx-check"></i>
                    Accepter tous les cookies
                  </motion.button>

                  {/* Boutons secondaires */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={rejectOptionalCookies}
                      className="py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Refuser
                    </motion.button>
                    <motion.button
                      onClick={() => setShowPreferences(true)}
                      className="py-2.5 border border-[#FFA600] text-[#FFA600] font-medium rounded-xl hover:bg-[#FFA600]/5 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Personnaliser
                    </motion.button>
                  </div>
                </div>

                {/* Lien politique de confidentialité */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    En continuant, vous acceptez notre{' '}
                    <Link to="/cgv-politique" className="text-[#FFA600] hover:underline font-medium">
                      Politique de Confidentialité
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal des préférences */}
      <AnimatePresence>
        {showPreferences && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowPreferences(false)}
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#FFA600] to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <i className="bx bx-cog text-2xl"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Préférences des Cookies</h2>
                      <p className="text-sm opacity-90">Personnalisez vos paramètres</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <i className="bx bx-x text-2xl"></i>
                  </button>
                </div>
              </div>

              {/* Contenu scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                <div className="space-y-6">
                  
                  {/* Cookies nécessaires */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <i className="bx bx-shield-check text-green-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Cookies Nécessaires</h3>
                          <p className="text-sm text-gray-600">Indispensables au fonctionnement</p>
                        </div>
                      </div>
                      <div className="bg-green-500 rounded-full p-1">
                        <i className="bx bx-check text-white text-sm"></i>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Ces cookies sont essentiels pour le fonctionnement de notre site web. 
                      Ils permettent la navigation, la sécurité et l'accès aux zones sécurisées.
                    </p>
                  </div>

                  {/* Cookies analytiques */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <i className="bx bx-bar-chart-alt-2 text-blue-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Cookies Analytiques</h3>
                          <p className="text-sm text-gray-600">Statistiques d'utilisation</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences.analytics}
                          onChange={() => handlePreferenceChange('analytics')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFA600]"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Ces cookies nous aident à comprendre comment vous utilisez notre site 
                      pour améliorer votre expérience (Google Analytics, heatmaps).
                    </p>
                  </div>

                  {/* Cookies marketing */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <i className="bx bx-target-lock text-purple-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Cookies Marketing</h3>
                          <p className="text-sm text-gray-600">Publicité personnalisée</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences.marketing}
                          onChange={() => handlePreferenceChange('marketing')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFA600]"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Ces cookies permettent de vous proposer des publicités pertinentes 
                      et de mesurer l'efficacité de nos campagnes publicitaires.
                    </p>
                  </div>

                  {/* Cookies de préférences */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <i className="bx bx-user-circle text-orange-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Cookies de Préférences</h3>
                          <p className="text-sm text-gray-600">Personnalisation du site</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences.preferences}
                          onChange={() => handlePreferenceChange('preferences')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFA600]"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Ces cookies mémorisent vos préférences (langue, région, thème) 
                      pour personnaliser votre expérience de navigation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer avec boutons */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => setShowPreferences(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    onClick={() => savePreferences(cookiePreferences)}
                    className="flex-1 py-3 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white font-semibold rounded-xl hover:from-[#FF9500] hover:to-orange-600 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enregistrer les préférences
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieBanner; 