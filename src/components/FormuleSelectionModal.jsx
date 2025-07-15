import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FormuleSelectionModal({ 
  showModal, 
  onCloseModal, 
  selectedFormule, 
  formules, 
  additionalFormules, 
  onToggleAdditionalFormule, 
  onProceedToReservation, 
  onReserveDirectly,
  vehicleType,
  // Options supplémentaires
  options = {
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
  },
  onOptionQuantityChange,
  onOptionToggle
}) {
  if (!selectedFormule) return null;

  // État pour le modal de confirmation sur mobile
  const [showMobileConfirmation, setShowMobileConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  // Gérer l'affichage du header et footer quand le modal est ouvert
  useEffect(() => {
    // Fonction pour ajouter les styles CSS
    const addModalStyles = () => {
      const styleId = 'modal-hide-styles';
      let existingStyle = document.getElementById(styleId);
      
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .modal-open header,
          .modal-open footer {
            display: none !important;
          }
          .modal-open {
            overflow: hidden !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    // Fonction pour masquer header/footer
    const hideHeaderFooter = () => {
      addModalStyles();
      document.body.classList.add('modal-open');
      console.log('✅ Modal ouvert - Header/Footer masqués');
    };

    // Fonction pour restaurer header/footer
    const showHeaderFooter = () => {
      document.body.classList.remove('modal-open');
      console.log('✅ Modal fermé - Header/Footer restaurés');
    };

    // Logique principale
    if (showModal || showMobileConfirmation) {
      hideHeaderFooter();
    } else {
      // FORCER la restauration à chaque fermeture
      setTimeout(() => {
        showHeaderFooter();
        console.log('🔄 Restauration forcée du header/footer');
      }, 100);
    }

    // Cleanup robuste au démontage
    return () => {
      showHeaderFooter();
      console.log('🧹 Cleanup - Header/Footer restaurés');
    };
  }, [showModal, showMobileConfirmation]);

  // Effet supplémentaire pour s'assurer de la restauration à la fermeture
  useEffect(() => {
    if (!showModal && !showMobileConfirmation) {
      // Double vérification - restaurer header/footer si modal fermé
      const timer = setTimeout(() => {
        document.body.classList.remove('modal-open');
        console.log('🔍 Double vérification - Header/Footer restaurés');
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [showModal, showMobileConfirmation]);

  // Vérifier si on est sur mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Fonction pour forcer la restauration du header/footer
  const forceRestoreHeaderFooter = () => {
    document.body.classList.remove('modal-open');
    console.log('🚨 Restauration forcée du header/footer');
  };

  // Handlers pour la confirmation sur mobile
  const handleContinueClick = () => {
    if (isMobile) {
      setConfirmationAction(() => onProceedToReservation);
      setShowMobileConfirmation(true);
    } else {
      onProceedToReservation();
    }
  };

  const handleReserveDirectlyClick = () => {
    if (isMobile) {
      setConfirmationAction(() => () => onReserveDirectly(selectedFormule));
      setShowMobileConfirmation(true);
    } else {
      onReserveDirectly(selectedFormule);
    }
  };

  const handleConfirmAction = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    setShowMobileConfirmation(false);
    setConfirmationAction(null);
    // Forcer la restauration
    setTimeout(forceRestoreHeaderFooter, 100);
  };

  const handleCancelConfirmation = () => {
    setShowMobileConfirmation(false);
    setConfirmationAction(null);
    // Forcer la restauration
    setTimeout(forceRestoreHeaderFooter, 100);
  };

  // Gestionnaire de fermeture amélioré
  const handleCloseModal = () => {
    onCloseModal();
    // Forcer la restauration immédiatement
    setTimeout(forceRestoreHeaderFooter, 100);
  };

  // Fonction pour calculer le prix d'une option avec réduction automatique
  const calculateOptionPrice = (option) => {
    if (!option) return 0;
    const { quantity = 0, prix_unitaire = 0, prix_x4 = 0 } = option;
    const qty = parseFloat(quantity) || 0;
    const priceUnit = parseFloat(prix_unitaire) || 0;
    const priceX4 = parseFloat(prix_x4) || 0;
    
    if (qty === 0) return 0;
    if (qty >= 4 && priceX4 > 0) {
      return priceX4;
    }
    return qty * priceUnit;
  };

  // Fonction pour calculer le prix total des options
  const calculateTotalOptionsPrice = () => {
    let total = 0;

    // Options avec quantité et réduction x4
    total += calculateOptionPrice(options.baume_sieges);
    
    // Services de pressing masqués si lavage premium sélectionné
    if (!(options.lavage_premium && options.lavage_premium.selected)) {
      total += calculateOptionPrice(options.pressing_sieges);
      total += calculateOptionPrice(options.pressing_tapis);
      total += calculateOptionPrice(options.pressing_panneau_porte);
    }
    
    total += calculateOptionPrice(options.renov_phare);

    // Options à prix fixe avec quantité (masquées si lavage premium)
    if (!(options.lavage_premium && options.lavage_premium.selected)) {
      const quantity = parseFloat(options.pressing_coffre_plafonnier?.quantity) || 0;
      const unitPrice = parseFloat(options.pressing_coffre_plafonnier?.prix_unitaire) || 0;
      total += quantity * unitPrice;
    }

    // Options à prix fixe simple
    if (options.assaisonnement_ozone?.selected) {
      const ozonePrice = parseFloat(options.assaisonnement_ozone?.prix) || 0;
      total += ozonePrice;
    }
    
    // Option lavage premium
    if (options.lavage_premium && options.lavage_premium.selected) {
      const lavagePremiumPrice = parseFloat(selectedFormule?.lavage_premium_prix) || parseFloat(options.lavage_premium.prix) || 120;
      total += lavagePremiumPrice;
    }

    return isNaN(total) ? 0 : total;
  };

  const getTotalPrice = () => {
    const basePrice = parseFloat(selectedFormule?.prix || 0) || 0;
    const additionalFormulePrice = additionalFormules.reduce((sum, f) => sum + (parseFloat(f.prix) || 0), 0);
    const optionsPrice = calculateTotalOptionsPrice() || 0;
    const total = basePrice + additionalFormulePrice + optionsPrice;
    
    // S'assurer que total est un nombre valide avant d'appeler toFixed
    if (typeof total !== 'number' || isNaN(total)) {
      return '0.00';
    }
    
    return total.toFixed(2);
  };

  const getVehicleTypeLabel = () => {
    const labels = {
      'petite-citadine': 'Petite Citadine',
      'citadine': 'Citadine',
      'berline': 'Berline',
      'suv': 'SUV / 4x4'
    };
    return labels[vehicleType] || vehicleType;
  };

  return (
    <>
      <AnimatePresence>
        {showModal && selectedFormule && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start sm:items-center justify-center p-1 sm:p-4 pt-4 sm:pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            style={{ 
              zIndex: 99999999, 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              width: '100vw',
              height: '100vh',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              willChange: 'transform',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
          <motion.div
            className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-[98%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-w-2xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              zIndex: 99999999, 
              position: 'relative',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              willChange: 'transform',
              isolation: 'isolate'
            }}
          >
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-[#FF0000] to-[#FF4500] p-4 sm:p-4   text-white relative" style={{ zIndex: 99999999 }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1 leading-tight">
                    🎯 Personnalisez votre réservation
                  </h2>
                  <p className="text-red-100 text-sm sm:text-base leading-relaxed">
                    💡 Ajoutez d'autres formules pour économiser !
                  </p>
                </div>
                <motion.button
                  onClick={handleCloseModal}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className="bx bx-x text-xl sm:text-2xl"></i>
                </motion.button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-2 sm:p-4 overflow-y-auto flex-1 min-h-0">
              {/* Formule principale sélectionnée */}
              <div className="mb-2">
                <div className="bg-gradient-to-r from-[#FF0000]/10 to-[#FF4500]/10 border border-[#FF0000]/30 rounded-md p-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div className="w-6 h-6 rounded bg-gradient-to-r from-[#FF0000] to-[#FF4500] flex items-center justify-center flex-shrink-0">
                        <i className={`${selectedFormule.icone} text-xs text-white`}></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-800 text-xs break-words leading-tight">{selectedFormule.nom}</h4>
                        <p className="text-xs text-gray-500">{selectedFormule.duree}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-1">
                      <div className="text-xs font-bold text-[#FF0000] bg-white px-1.5 py-0.5 rounded shadow-sm">{selectedFormule.prix}€</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formules supplémentaires disponibles */}
              <div className="mb-4 hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-dashed border-green-300 mb-3 shadow-sm">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <i className="bx bx-plus-circle text-green-600 animate-pulse"></i>
                    <span>🌟 Formules supplémentaires</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-tight">
                    💰 <span className="font-bold text-green-600">Économisez en combinant !</span>
                  </p>
                </div>
                <div className="space-y-2">
                                            {formules
                    .filter(formule => formule.id !== selectedFormule?.id)
                    .map((formule) => {
                      const isSelected = additionalFormules.find(f => f.id === formule.id);
                      return (
                        <motion.div
                          key={formule.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                            isSelected 
                              ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50' 
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                          }`}
                          onClick={() => onToggleAdditionalFormule(formule)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                <i className={`${formule.icone} text-sm sm:text-base`}></i>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-800 text-xs sm:text-sm break-words leading-tight">{formule.nom}</h4>
                                <p className="text-xs text-gray-600 mt-0.5">{formule.duree}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                              <div className="text-sm font-bold text-green-600 bg-white px-2 py-1 rounded-md shadow-sm">+{formule.prix}€</div>
                              {isSelected ? (
                                <motion.div 
                                  className="flex items-center justify-center mt-1"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                    <i className="bx bx-check-circle text-xs"></i>
                                    Ajoutée
                                  </span>
                                </motion.div>
                              ) : (
                                <div className="text-xs text-gray-500 text-center mt-1">
                                  Ajouter
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>



              {/* Options supplémentaires */}
              <div className="mb-4">
                {/* Lavage Premium - Uniquement si cette formule l'inclut */}
                {selectedFormule?.lavage_premium && (
                  <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 hover:border-purple-300 transition-all shadow-sm mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">💎Option Lavage Premium</span>
                        <div className="text-xs text-purple-700">
                          ce service inclus les prestations prenium pressing des sieges des plastiques des tapis + pressing coffre/plafonnier
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <motion.button
                          onClick={() => onOptionToggle && onOptionToggle('lavage_premium')}
                          className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors flex items-center ${
                            options.lavage_premium?.selected ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform ${
                            options.lavage_premium?.selected ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </motion.button>
                        <div className={`font-bold text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md ${
                          options.lavage_premium?.selected 
                            ? 'bg-purple-50 text-purple-600' 
                            : 'bg-gray-50 text-gray-400'
                        }`}>
                          {options.lavage_premium?.selected ? `+${selectedFormule?.lavage_premium_prix || 120}€` : '0€'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Options avec quantité */}
                <div className="space-y-2 mb-3">


                  {/* Baume sièges */}
                  <div className="bg-white rounded-lg p-1.5 sm:p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">💺 Baume sièges  20 €/unité </span>
                        <div className="text-xs text-gray-600">x1: 20€ | x4: 60€ ⚡</div>
                      </div>
                      {options.baume_sieges.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1 py-0.5 sm:px-1.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('baume_sieges', Math.max(0, options.baume_sieges.quantity - 1))}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-xs sm:text-sm"></i>
                      </motion.button>
                      <span className="w-8 sm:w-10 text-center font-bold text-gray-800 text-xs sm:text-sm bg-gray-100 py-1 rounded-md">{options.baume_sieges.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('baume_sieges', options.baume_sieges.quantity + 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-xs sm:text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-xs sm:text-sm bg-blue-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                        {calculateOptionPrice(options.baume_sieges) > 0 ? `+${calculateOptionPrice(options.baume_sieges)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Pressing des sièges - Masqué si Lavage Premium activé */}
                  <div className={`bg-white rounded-lg p-1.5 sm:p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm ${
                    options.lavage_premium && options.lavage_premium.selected ? 'hidden' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">🧽 Pressing des sièges  30€/unité</span>
                        <div className="text-xs text-gray-600">x1: 30€ | x4: 75€ ⚡</div>
                      </div>
                      {options.pressing_sieges.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1 py-0.5 sm:px-1.5 rounded-full text-xs font-bold">
                          PROMO !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_sieges', Math.max(0, options.pressing_sieges.quantity - 1))}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-xs sm:text-sm"></i>
                      </motion.button>
                      <span className="w-8 sm:w-10 text-center font-bold text-gray-800 text-xs sm:text-sm bg-gray-100 py-1 rounded-md">{options.pressing_sieges.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_sieges', options.pressing_sieges.quantity + 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-xs sm:text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-xs sm:text-sm bg-blue-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                        {calculateOptionPrice(options.pressing_sieges) > 0 ? `+${calculateOptionPrice(options.pressing_sieges)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Pressing des tapis - Masqué si Lavage Premium activé */}
                  <div className={`bg-white rounded-lg p-1.5 sm:p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm ${
                    options.lavage_premium && options.lavage_premium.selected ? 'hidden' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">🏠 Pressing des tapis 30€/unité</span>
                        <div className="text-xs text-gray-600">x1: 30€ | x4: 75€ ⚡</div>
                      </div>
                      {options.pressing_tapis.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1 py-0.5 sm:px-1.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_tapis', Math.max(0, options.pressing_tapis.quantity - 1))}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-xs sm:text-sm"></i>
                      </motion.button>
                      <span className="w-8 sm:w-10 text-center font-bold text-gray-800 text-xs sm:text-sm bg-gray-100 py-1 rounded-md">{options.pressing_tapis.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_tapis', options.pressing_tapis.quantity + 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-xs sm:text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-xs sm:text-sm bg-blue-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                        {calculateOptionPrice(options.pressing_tapis) > 0 ? `+${calculateOptionPrice(options.pressing_tapis)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Pressing panneau de porte - Masqué si Lavage Premium activé */}
                  <div className={`bg-white rounded-lg p-1.5 sm:p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm ${
                    options.lavage_premium && options.lavage_premium.selected ? 'hidden' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">🚪 Pressing panneau de porte 30€/unité</span>
                        <div className="text-xs text-gray-600">x1: 30€ | x4: 75€ ⚡</div>
                      </div>
                      {options.pressing_panneau_porte.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1 py-0.5 sm:px-1.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_panneau_porte', Math.max(0, options.pressing_panneau_porte.quantity - 1))}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-xs sm:text-sm"></i>
                      </motion.button>
                      <span className="w-8 sm:w-10 text-center font-bold text-gray-800 text-xs sm:text-sm bg-gray-100 py-1 rounded-md">{options.pressing_panneau_porte.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_panneau_porte', options.pressing_panneau_porte.quantity + 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-xs sm:text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-xs sm:text-sm bg-blue-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                        {calculateOptionPrice(options.pressing_panneau_porte) > 0 ? `+${calculateOptionPrice(options.pressing_panneau_porte)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Renov phare */}
                  <div className="bg-white rounded-lg p-1.5 sm:p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">💡 Renov phare 30€/unité</span>
                        <div className="text-xs text-gray-600">x1: 30€ | x4: 100€ ⚡</div>
                      </div>
                      {options.renov_phare.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1 py-0.5 sm:px-1.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('renov_phare', Math.max(0, options.renov_phare.quantity - 1))}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-xs sm:text-sm"></i>
                      </motion.button>
                      <span className="w-8 sm:w-10 text-center font-bold text-gray-800 text-xs sm:text-sm bg-gray-100 py-1 rounded-md">{options.renov_phare.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('renov_phare', options.renov_phare.quantity + 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-xs sm:text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-xs sm:text-sm bg-blue-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                        {calculateOptionPrice(options.renov_phare) > 0 ? `+${calculateOptionPrice(options.renov_phare)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Pressing coffre/plafonnier - Masqué si Lavage Premium activé */}
                  <div className={`bg-white rounded-lg p-1.5 sm:p-3 border border-gray-200 hover:border-purple-300 transition-all shadow-sm ${
                    options.lavage_premium && options.lavage_premium.selected ? 'hidden' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">📦 Pressing coffre/plafonnier 30€/unité</span>
                        <div className="text-xs text-gray-600">Prix fixe: 30€/unité 💼</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_coffre_plafonnier', Math.max(0, options.pressing_coffre_plafonnier.quantity - 1))}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-xs sm:text-sm"></i>
                      </motion.button>
                      <span className="w-8 sm:w-10 text-center font-bold text-gray-800 text-xs sm:text-sm bg-gray-100 py-1 rounded-md">{options.pressing_coffre_plafonnier.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_coffre_plafonnier', options.pressing_coffre_plafonnier.quantity + 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-xs sm:text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-purple-600 text-xs sm:text-sm bg-purple-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                        {(options.pressing_coffre_plafonnier.quantity * options.pressing_coffre_plafonnier.prix_unitaire) > 0 ? `+${options.pressing_coffre_plafonnier.quantity * options.pressing_coffre_plafonnier.prix_unitaire}€` : '0€'}
                      </div>
                    </div>
                  </div>
                </div>



                {/* Options on/off */}
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm flex items-center gap-2 bg-gray-50 p-1.5 sm:p-2 rounded-lg">
                    <i className="bx bx-toggle-left text-orange-600"></i>
                    <span>🌟 Services spéciaux</span>
                  </h4>

                  {/* Assaisonnement à l'ozone */}
                  <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 hover:border-orange-300 transition-all shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">🌬️ Assaisonnement à l'ozone</span>
                        <div className="text-xs text-gray-600">Durée: 20-25min | Prix: 30€ 🦠</div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <motion.button
                          onClick={() => onOptionToggle && onOptionToggle('assaisonnement_ozone')}
                          className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors flex items-center ${
                            options.assaisonnement_ozone.selected ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform ${
                            options.assaisonnement_ozone.selected ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </motion.button>
                        <div className={`font-bold text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md ${
                          options.assaisonnement_ozone.selected 
                            ? 'bg-orange-50 text-orange-600' 
                            : 'bg-gray-50 text-gray-400'
                        }`}>
                          {options.assaisonnement_ozone.selected ? '+30€' : '0€'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services sur devis */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-gray-600 flex items-center gap-2 px-2">
                      <i className="bx bx-receipt text-yellow-600"></i>
                      💼 Services sur devis
                    </h5>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-yellow-300 transition-all shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-800 text-xs sm:text-sm">✨ Renov chrome</span>
                          <div className="text-xs text-yellow-600">Prix personnalisé selon véhicule 💎</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={() => onOptionToggle && onOptionToggle('renov_chrome')}
                            className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                              options.renov_chrome.selected ? 'bg-yellow-500' : 'bg-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              options.renov_chrome.selected ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </motion.button>
                          <div className={`font-bold text-sm px-2 py-1 rounded-md ${
                            options.renov_chrome.selected 
                              ? 'bg-yellow-50 text-yellow-600' 
                              : 'bg-gray-50 text-gray-400'
                          }`}>
                            {options.renov_chrome.selected ? 'Devis' : '---'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-yellow-300 transition-all shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-800 text-xs sm:text-sm">🔥 Polissage</span>
                          <div className="text-xs text-yellow-600">Restauration carrosserie personnalisée ✨</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={() => onOptionToggle && onOptionToggle('polissage')}
                            className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                              options.polissage.selected ? 'bg-yellow-500' : 'bg-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              options.polissage.selected ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </motion.button>
                          <div className={`font-bold text-sm px-2 py-1 rounded-md ${
                            options.polissage.selected 
                              ? 'bg-yellow-50 text-yellow-600' 
                              : 'bg-gray-50 text-gray-400'
                          }`}>
                            {options.polissage.selected ? 'Devis' : '---'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-yellow-300 transition-all shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-800 text-xs sm:text-sm">💎 Lustrage</span>
                          <div className="text-xs text-yellow-600">Finition premium haute brillance 🌟</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={() => onOptionToggle && onOptionToggle('lustrage')}
                            className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                              options.lustrage.selected ? 'bg-yellow-500' : 'bg-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              options.lustrage.selected ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </motion.button>
                          <div className={`font-bold text-sm px-2 py-1 rounded-md ${
                            options.lustrage.selected 
                              ? 'bg-yellow-50 text-yellow-600' 
                              : 'bg-gray-50 text-gray-400'
                          }`}>
                            {options.lustrage.selected ? 'Devis' : '---'}
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              {/* Récapitulatif */}
              <motion.div 
                className="bg-gradient-to-r from-green-50 to-blue-50 border border-[#FF0000]/20 rounded-lg p-1.5 sm:p-2 mb-2 sm:mb-3"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-2">
                  <i className="bx bx-receipt text-[#FF0000]"></i>
                  <span className="text-xs sm:text-sm">📋 Récapitulatif</span>
                  {additionalFormules.length > 0 && (
                    <span className="bg-[#FF0000] text-white px-1 py-0.5 sm:px-1.5 rounded-full text-xs font-bold">
                      {1 + additionalFormules.length}
                    </span>
                  )}
                </h3>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs sm:text-sm break-words pr-2 flex-1">{selectedFormule.nom}</span>
                    <span className="font-medium text-xs sm:text-sm flex-shrink-0">{selectedFormule.prix}€</span>
                  </div>
                  {additionalFormules.map((formule) => (
                    <div key={formule.id} className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm break-words pr-2 flex-1">{formule.nom}</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0">+{formule.prix}€</span>
                    </div>
                  ))}
                  
                  {/* Options sélectionnées */}
                  {options.baume_sieges.quantity > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Baume sièges x{options.baume_sieges.quantity}</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0">+{calculateOptionPrice(options.baume_sieges)}€</span>
                    </div>
                  )}
                  {options.pressing_sieges.quantity > 0 && !(options.lavage_premium && options.lavage_premium.selected) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Pressing sièges x{options.pressing_sieges.quantity}</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0">+{calculateOptionPrice(options.pressing_sieges)}€</span>
                    </div>
                  )}
                  {options.pressing_tapis.quantity > 0 && !(options.lavage_premium && options.lavage_premium.selected) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Pressing tapis x{options.pressing_tapis.quantity}</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0">+{calculateOptionPrice(options.pressing_tapis)}€</span>
                    </div>
                  )}
                  {options.pressing_panneau_porte.quantity > 0 && !(options.lavage_premium && options.lavage_premium.selected) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Pressing panneau porte x{options.pressing_panneau_porte.quantity}</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0">+{calculateOptionPrice(options.pressing_panneau_porte)}€</span>
                    </div>
                  )}
                  {options.renov_phare.quantity > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Renov phare x{options.renov_phare.quantity}</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0">+{calculateOptionPrice(options.renov_phare)}€</span>
                    </div>
                  )}
                  {options.pressing_coffre_plafonnier.quantity > 0 && !(options.lavage_premium && options.lavage_premium.selected) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Pressing coffre/plafonnier x{options.pressing_coffre_plafonnier.quantity}</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0">+{options.pressing_coffre_plafonnier.quantity * options.pressing_coffre_plafonnier.prix_unitaire}€</span>
                    </div>
                  )}
                  {options.assaisonnement_ozone.selected && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Assaisonnement ozone</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0">+{options.assaisonnement_ozone.prix}€</span>
                    </div>
                  )}
                  {options.lavage_premium && options.lavage_premium.selected && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">💎 Lavage Premium</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0 text-purple-600">+{selectedFormule?.lavage_premium_prix || options.lavage_premium.prix}€</span>
                    </div>
                  )}
                  {options.renov_chrome.selected && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Renov chrome (devis)</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0 text-orange-500">Sur devis</span>
                    </div>
                  )}
                  {options.polissage.selected && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Polissage (devis)</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0 text-orange-500">Sur devis</span>
                    </div>
                  )}
                  {options.lustrage.selected && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm pr-2 flex-1">Lustrage (devis)</span>
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0 text-orange-500">Sur devis</span>
                    </div>
                  )}
                  
                  <hr className="my-1.5 border-[#FF0000]/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-bold text-gray-800">💰 Total</span>
                    <motion.span 
                      className="text-sm sm:text-base font-bold text-[#FF0000] bg-white px-2 py-1 rounded-md"
                      key={getTotalPrice()}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {getTotalPrice()}€
                    </motion.span>
                  </div>
                  {calculateTotalOptionsPrice() > 0 && (
                    <div className="text-xs text-gray-500 text-center mt-0.5">
                      {additionalFormules.length > 0 ? 'Formules + Options' : 'Options incluses'}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Footer du modal */}
            <div className="border-t border-gray-200 p-1 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
              <div className="flex gap-1 sm:gap-4">
                <motion.button
                  onClick={handleReserveDirectlyClick}
                  className="flex-1 px-1 py-1 sm:px-4 sm:py-4 bg-white border border-gray-300 text-gray-700 rounded-md sm:rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-bold shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center justify-center gap-0 sm:gap-2">
                    <div className="flex items-center gap-0.5 sm:gap-2">
                      <i className="bx bx-check text-xs sm:text-lg"></i>
                      <span className="text-xs sm:text-base">Seule</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      {selectedFormule.prix}€
                    </div>
                  </div>
                </motion.button>
                <motion.button
                  onClick={handleContinueClick}
                  className="flex-1 px-1 py-1 sm:px-4 sm:py-4 bg-gradient-to-r from-[#FF0000] to-[#FF4500] hover:from-[#CC0000] hover:to-[#FF6600] text-white rounded-md sm:rounded-lg hover:shadow-xl transition-all font-bold shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center justify-center gap-0 sm:gap-2">
                    <div className="flex items-center gap-0.5 sm:gap-2">
                      <i className="bx bx-rocket text-xs sm:text-lg"></i>
                      <span className="text-xs sm:text-base">Continuer</span>
                    </div>
                    <div className="text-xs sm:text-sm text-red-100 font-medium">
                      Total: {getTotalPrice()}€
                    </div>
                  </div>
                </motion.button>
              </div>
              <div className="mt-0.5 sm:mt-2 text-center">
                <p className="text-xs text-gray-500 hidden sm:block">
                  💡 Modifiable avant validation
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
              )}

        {/* Modal de confirmation sur mobile */}
        {showMobileConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelConfirmation}
            style={{ 
              zIndex: 999999999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              willChange: 'transform'
            }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#FF0000] to-[#FF4500] p-4 text-white text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="bx bx-check-circle text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold">Confirmer votre choix</h3>
              </div>

              {/* Contenu */}
              <div className="p-6 text-center">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Êtes-vous sûr de votre sélection ? 
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Avez-vous bien regardé toutes les options disponibles ?</strong>
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    Faites défiler vers le haut pour découvrir d'autres services !
                  </p>
                </div>
                
                {/* Résumé du choix */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-gray-800 font-medium text-sm">Votre sélection :</p>
                  <p className="text-gray-600 text-xs mt-1">{selectedFormule.nom}</p>
                  <p className="text-[#FF0000] font-bold text-lg mt-1">
                    Total: {getTotalPrice()}€
                  </p>
                </div>
              </div>

              {/* Boutons */}
              <div className="border-t border-gray-200 p-4 flex gap-3">
                <motion.button
                  onClick={handleCancelConfirmation}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Modifier
                </motion.button>
                <motion.button
                  onClick={handleConfirmAction}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white rounded-lg hover:from-[#CC0000] hover:to-[#FF6600] transition-all font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirmer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FormuleSelectionModal; 
