import React, { useState, useEffect } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../config/api.js';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FormuleSelectionModal from '../components/FormuleSelectionModal';

function Berline() {
  const [formules, setFormules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFormule, setSelectedFormule] = useState(null);
  const [additionalFormules, setAdditionalFormules] = useState([]);
  const [options, setOptions] = useState({
    baume_sieges: { quantity: 0, prix_unitaire: 20, prix_x4: 60 },
    pressing_sieges: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
    pressing_tapis: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
    pressing_coffre_plafonnier: { quantity: 0, prix_unitaire: 30 },
    pressing_panneau_porte: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
    renov_phare: { quantity: 0, prix_unitaire: 30, prix_x4: 100 },
    renov_chrome: { selected: false },
    assaisonnement_ozone: { selected: false, prix: 30 },
    polissage: { selected: false },
    lustrage: { selected: false },
    lavage_premium: { selected: false, prix: 120 }
  });
  // Charger les formules au chargement du composant
  useEffect(() => {
    fetchFormules();
  }, []);

  // Fonction pour récupérer les formules
  const fetchFormules = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.BERLINE));
      if (!response.ok) throw new Error('Erreur lors de la récupération des formules');
      const data = await response.json();
      setFormules(data);
      setError('');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les formules. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ouvrir le modal de sélection
  const openReservationModal = (formule) => {
    setSelectedFormule(formule);
    setAdditionalFormules([]);
    setShowModal(true);
    
    // Initialiser les options, en activant lavage_premium si la formule l'inclut
    setOptions({
      baume_sieges: { quantity: 0, prix_unitaire: 20, prix_x4: 60 },
      pressing_sieges: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      pressing_tapis: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      pressing_coffre_plafonnier: { quantity: 0, prix_unitaire: 30 },
      pressing_panneau_porte: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      renov_phare: { quantity: 0, prix_unitaire: 30, prix_x4: 100 },
      renov_chrome: { selected: false },
      assaisonnement_ozone: { selected: false, prix: 30 },
      polissage: { selected: false },
      lustrage: { selected: false },
      lavage_premium: { selected: false, prix: 120 }
    });
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedFormule(null);
    setAdditionalFormules([]);
    // Réinitialiser les options
    setOptions({
      baume_sieges: { quantity: 0, prix_unitaire: 20, prix_x4: 60 },
      pressing_sieges: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      pressing_tapis: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      pressing_coffre_plafonnier: { quantity: 0, prix_unitaire: 30 },
      pressing_panneau_porte: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      renov_phare: { quantity: 0, prix_unitaire: 30, prix_x4: 100 },
      renov_chrome: { selected: false },
      assaisonnement_ozone: { selected: false, prix: 30 },
      polissage: { selected: false },
      lustrage: { selected: false },
      lavage_premium: { selected: false, prix: 120 }
    });
  };

  // Fonction pour gérer les changements de quantité des options
  const handleOptionQuantityChange = (optionName, newQuantity) => {
    setOptions(prev => ({
      ...prev,
      [optionName]: {
        ...prev[optionName],
        quantity: Math.max(0, newQuantity)
      }
    }));
  };

  // Fonction pour gérer les options on/off
  const handleOptionToggle = (optionName) => {
    setOptions(prev => {
      const newOptions = { ...prev };
      
      // Si c'est l'option lavage premium qu'on active
      if (optionName === 'lavage_premium' && !prev[optionName].selected) {
        // Décocher automatiquement les options pressing
        newOptions.pressing_sieges = { ...prev.pressing_sieges, quantity: 0 };
        newOptions.pressing_tapis = { ...prev.pressing_tapis, quantity: 0 };
        newOptions.pressing_panneau_porte = { ...prev.pressing_panneau_porte, quantity: 0 };
      }
      
      // Toggle l'option demandée
      newOptions[optionName] = {
        ...prev[optionName],
        selected: !prev[optionName].selected
      };
      
      return newOptions;
    });
  };

  // Fonction pour calculer le prix d'une option avec réduction automatique
  const calculateOptionPrice = (option) => {
    const { quantity, prix_unitaire, prix_x4 } = option;
    if (quantity === 0) return 0;
    if (quantity >= 4 && prix_x4) {
      return prix_x4;
    }
    return quantity * prix_unitaire;
  };

  // Fonction pour calculer le prix total des options
  const calculateTotalOptionsPrice = () => {
    let total = 0;

    // Options avec quantité et réduction x4
    total += calculateOptionPrice(options.baume_sieges);
    total += calculateOptionPrice(options.pressing_sieges);
    total += calculateOptionPrice(options.pressing_tapis);
    total += calculateOptionPrice(options.pressing_panneau_porte);
    total += calculateOptionPrice(options.renov_phare);

    // Options à prix fixe avec quantité
    total += options.pressing_coffre_plafonnier.quantity * options.pressing_coffre_plafonnier.prix_unitaire;

    // Options à prix fixe simple
    if (options.assaisonnement_ozone.selected) {
      total += options.assaisonnement_ozone.prix;
    }
    
    // Option lavage premium
    if (options.lavage_premium.selected) {
      total += selectedFormule?.lavage_premium_prix || options.lavage_premium.prix;
    }

    return isNaN(total) ? 0 : total;
  };

  // Fonction pour ajouter/retirer une formule supplémentaire
  const toggleAdditionalFormule = (formule) => {
    setAdditionalFormules(prev => {
      const isAlreadySelected = prev.find(f => f.id === formule.id);
      if (isAlreadySelected) {
        return prev.filter(f => f.id !== formule.id);
      } else {
        return [...prev, formule];
      }
    });
  };

  // Fonction pour procéder à la réservation
  const proceedToReservation = () => {
    const allFormules = [selectedFormule, ...additionalFormules];
    const formulesParam = allFormules.map(f => f.nom).join(',');
    const formulesPrice = allFormules.reduce((sum, f) => sum + (parseFloat(f.prix) || 0), 0);
    const optionsPrice = calculateTotalOptionsPrice() || 0;
    const totalPrice = formulesPrice + optionsPrice;
    
    // S'assurer que totalPrice est un nombre valide
    const safeTotalPrice = isNaN(totalPrice) || typeof totalPrice !== 'number' ? 0 : totalPrice;
    
    const params = new URLSearchParams({
      formule: formulesParam,
      type: 'berline',
      prix_total: safeTotalPrice.toFixed(2),
      options: JSON.stringify(options)
    });
    
    window.location.href = `/reservation?${params.toString()}`;
  };

  // Fonction pour réserver directement sans formules supplémentaires
  const reserveDirectly = (formule) => {
    const params = new URLSearchParams({
      formule: formule.nom,
      type: 'berline'
    });
    
    window.location.href = `/reservation?${params.toString()}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Cercles d'ambiance */}
      <div className="light-circle circle1"></div>
      <div className="light-circle circle2"></div>
      <div className="light-circle circle3"></div>
      <div className="light-circle circle4"></div>
      <div className="light-circle circle5"></div>
      <div className="light-circle circle6"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header avec titre et navigation */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF0000] to-[#FF4500]">
            Formules Berline
        </h1>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez nos formules spécialement conçues pour les berlines
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-[#FF0000]"
          >
            <i className="bx bx-arrow-back text-lg"></i>
            Retour à l'accueil
          </Link>
        </motion.div>

        {/* Gestion des états de chargement et d'erreur */}
        {loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0000]"></div>
            <p className="text-gray-600 mt-4">Chargement des formules...</p>
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
              <i className="bx bx-error-circle text-red-400 text-4xl mb-4"></i>
              <p className="text-red-600">{error}</p>
              <motion.button 
                onClick={fetchFormules}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Réessayer
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Affichage des formules */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {formules.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                variants={itemVariants}
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                  <i className="bx bx-info-circle text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune formule disponible</h3>
                  <p className="text-gray-600">
                    Les formules pour berlines ne sont pas encore configurées.
                  </p>
          </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 sm:px-0">
                {formules.map((formule, index) => (
                  <motion.div 
                    key={formule.id} 
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105 relative group h-full flex flex-col"
                    variants={itemVariants}
                    custom={index}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Header de la carte - Hauteur fixe */}
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-[#FF0000] to-[#FF4500] flex-shrink-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <i className={`${formule.icone} text-lg sm:text-2xl text-[#FF0000]`}></i>
                        </div>
          <div>
                          <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-2">{formule.nom}</h2>
                          <p className="text-red-100 text-xs sm:text-sm">{formule.duree}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contenu de la carte - Prend l'espace restant */}
                    <div className="p-4 sm:p-6 relative flex flex-col flex-grow">
                      {/* Services inclus - Espace variable */}
                      <div className="mb-4 sm:mb-6 flex-grow">
                        <h3 className="text-gray-800 font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <i className="bx bx-list-check text-[#FF0000]"></i>
                          Services inclus
                        </h3>
                        <ul className="space-y-1 sm:space-y-2 min-h-[100px] sm:min-h-[120px]">
                          {formule.services.map((service, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <i className="bx bx-check text-[#FF0000] flex-shrink-0 mt-0.5"></i>
                              <span className="text-gray-600 leading-relaxed">{service}</span>
                </li>
                          ))}
              </ul>
            </div>

                      {/* Prix - Hauteur fixe */}
                      <div className="bg-gradient-to-r from-[#FF0000]/10 to-[#CC0000]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-[#FF0000]/20 mb-4 sm:mb-6 flex-shrink-0">
                        <div className="text-2xl sm:text-3xl font-bold text-[#FF0000] mb-1">
                          {formule.prix}€
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">Prix de la formule</p>
                </div>

                      {/* Bouton de réservation - Toujours en bas */}
                      <div className="mt-auto">
                        <motion.button
                          onClick={() => openReservationModal(formule)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white rounded-lg sm:rounded-xl hover:from-[#CC0000] hover:to-[#990000] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <i className="bx bx-calendar-plus mr-1 sm:mr-2"></i>
                          Réserver cette formule
                        </motion.button>
                </div>
                </div>
                  </motion.div>
                ))}
                </div>
            )}
          </motion.div>
        )}

        {/* Section d'information supplémentaire */}
        {!loading && !error && formules.length > 0 && (
          <motion.div 
            className="mt-16 bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Besoin d'aide pour choisir ?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Nos experts sont là pour vous conseiller et vous aider à choisir la formule 
                la plus adaptée à votre berline. N'hésitez pas à nous contacter !
              </p>
              <div className="flex justify-center">
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white rounded-xl hover:shadow-lg transition-shadow inline-flex items-center justify-center gap-2 font-medium"
                >
                  <i className="bx bx-phone"></i>
                  Nous contacter
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Modal de sélection de formules supplémentaires */}
        <FormuleSelectionModal
          showModal={showModal}
          onCloseModal={closeModal}
          selectedFormule={selectedFormule}
          formules={formules}
          additionalFormules={additionalFormules}
          onToggleAdditionalFormule={toggleAdditionalFormule}
          onProceedToReservation={proceedToReservation}
          onReserveDirectly={reserveDirectly}
          vehicleType="berline"
          options={options}
          onOptionQuantityChange={handleOptionQuantityChange}
          onOptionToggle={handleOptionToggle}

        />
      </div>
    </div>
  );
}

export default Berline; 
