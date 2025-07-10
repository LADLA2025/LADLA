import React from 'react';
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
    if (options.lavage_premium && options.lavage_premium.selected) {
      total += options.lavage_premium.prix;
    }

    return total;
  };

  const getTotalPrice = () => {
    const basePrice = parseFloat(selectedFormule.prix);
    const additionalFormulePrice = additionalFormules.reduce((sum, f) => sum + parseFloat(f.prix), 0);
    const optionsPrice = calculateTotalOptionsPrice();
    return (basePrice + additionalFormulePrice + optionsPrice).toFixed(2);
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
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseModal}
        >
          <motion.div
            className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-[96%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-w-2xl max-h-[80vh] sm:max-h-[75vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-[#FF0000] to-[#FF4500] p-4 sm:p-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold mb-1 leading-tight">
                    🎯 Personnalisez votre réservation
                  </h2>
                  <p className="text-red-100 text-xs sm:text-sm leading-relaxed">
                    💡 Ajoutez d'autres formules pour économiser !
                  </p>
                </div>
                <motion.button
                  onClick={onCloseModal}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0 mt-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className="bx bx-x text-xl sm:text-2xl"></i>
                </motion.button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 min-h-0">
              {/* Formule principale sélectionnée */}
              <div className="mb-4">
                <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  <span>Formule sélectionnée</span>
                </h3>
                <div className="bg-gradient-to-r from-[#FF0000]/10 to-[#FF4500]/10 border border-[#FF0000]/30 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-[#FF0000] to-[#FF4500] flex items-center justify-center flex-shrink-0">
                        <i className={`${selectedFormule.icone} text-base sm:text-lg text-white`}></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-800 text-xs sm:text-sm break-words leading-tight">{selectedFormule.nom}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{selectedFormule.duree}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-sm sm:text-base font-bold text-[#FF0000] bg-white px-2 py-1 rounded-md shadow-sm">{selectedFormule.prix}€</div>
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
                    .filter(formule => formule.id !== selectedFormule.id)
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

              {/* Lavage Premium - Uniquement si cette formule l'inclut */}
              {selectedFormule.lavage_premium && (
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-dashed border-purple-300 mb-3 shadow-sm">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <i className="bx bx-diamond text-purple-600 animate-pulse"></i>
                      <span>💎 Lavage Premium</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-tight">
                      ⭐ <span className="font-bold text-purple-600">Option premium incluse dans cette formule !</span>
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-300 hover:border-purple-400 transition-all shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">💎 Lavage Premium</span>
                        <div className="text-xs text-purple-700">
                          {options.lavage_premium.selected 
                            ? "✅ Remplace pressing sièges, tapis et panneaux | +120€ ⭐" 
                            : "Remplace automatiquement pressing sièges, tapis et panneaux | +120€ ⭐"
                          }
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => onOptionToggle && onOptionToggle('lavage_premium')}
                          className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                            options.lavage_premium.selected ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            options.lavage_premium.selected ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </motion.button>
                        <div className={`font-bold text-sm px-2 py-1 rounded-md ${
                          options.lavage_premium.selected 
                            ? 'bg-purple-50 text-purple-600' 
                            : 'bg-gray-50 text-gray-400'
                        }`}>
                          {options.lavage_premium.selected ? '+120€' : '0€'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Options supplémentaires */}
              <div className="mb-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-dashed border-blue-300 mb-3 shadow-sm">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <i className="bx bx-cog text-blue-600 animate-spin" style={{ animationDuration: '3s' }}></i>
                    <span>⭐ Options supplémentaires</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-tight">
                    🔧 <span className="font-bold text-blue-600">Personnalisez votre service !</span>
                  </p>
                </div>

                {/* Options avec quantité */}
                <div className="space-y-3 mb-4">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <i className="bx bx-wrench text-blue-600"></i>
                    <span>🔢 Services avec quantité</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">Réduction x4</span>
                  </h4>

                  {/* Baume sièges */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">💺 Baume sièges</span>
                        <div className="text-xs text-gray-600">x1: 20€ | x4: 60€ ⚡</div>
                      </div>
                      {options.baume_sieges.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('baume_sieges', Math.max(0, options.baume_sieges.quantity - 1))}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-sm"></i>
                      </motion.button>
                      <span className="w-10 text-center font-bold text-gray-800 text-sm bg-gray-100 py-1 rounded-md">{options.baume_sieges.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('baume_sieges', options.baume_sieges.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-md">
                        {calculateOptionPrice(options.baume_sieges) > 0 ? `+${calculateOptionPrice(options.baume_sieges)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Pressing des sièges - Masqué si Lavage Premium activé */}
                  <div className={`bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm ${
                    options.lavage_premium && options.lavage_premium.selected ? 'hidden' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">🧽 Pressing des sièges</span>
                        <div className="text-xs text-gray-600">x1: 30€ | x4: 75€ ⚡</div>
                      </div>
                      {options.pressing_sieges.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_sieges', Math.max(0, options.pressing_sieges.quantity - 1))}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-sm"></i>
                      </motion.button>
                      <span className="w-10 text-center font-bold text-gray-800 text-sm bg-gray-100 py-1 rounded-md">{options.pressing_sieges.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_sieges', options.pressing_sieges.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-md">
                        {calculateOptionPrice(options.pressing_sieges) > 0 ? `+${calculateOptionPrice(options.pressing_sieges)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Pressing des tapis - Masqué si Lavage Premium activé */}
                  <div className={`bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm ${
                    options.lavage_premium && options.lavage_premium.selected ? 'hidden' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">🏠 Pressing des tapis</span>
                        <div className="text-xs text-gray-600">x1: 30€ | x4: 75€ ⚡</div>
                      </div>
                      {options.pressing_tapis.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_tapis', Math.max(0, options.pressing_tapis.quantity - 1))}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-sm"></i>
                      </motion.button>
                      <span className="w-10 text-center font-bold text-gray-800 text-sm bg-gray-100 py-1 rounded-md">{options.pressing_tapis.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_tapis', options.pressing_tapis.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-md">
                        {calculateOptionPrice(options.pressing_tapis) > 0 ? `+${calculateOptionPrice(options.pressing_tapis)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Pressing panneau de porte - Masqué si Lavage Premium activé */}
                  <div className={`bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm ${
                    options.lavage_premium && options.lavage_premium.selected ? 'hidden' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">🚪 Pressing panneau de porte</span>
                        <div className="text-xs text-gray-600">x1: 30€ | x4: 75€ ⚡</div>
                      </div>
                      {options.pressing_panneau_porte.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_panneau_porte', Math.max(0, options.pressing_panneau_porte.quantity - 1))}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-sm"></i>
                      </motion.button>
                      <span className="w-10 text-center font-bold text-gray-800 text-sm bg-gray-100 py-1 rounded-md">{options.pressing_panneau_porte.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_panneau_porte', options.pressing_panneau_porte.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-md">
                        {calculateOptionPrice(options.pressing_panneau_porte) > 0 ? `+${calculateOptionPrice(options.pressing_panneau_porte)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Renov phare */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">💡 Renov phare</span>
                        <div className="text-xs text-gray-600">x1: 30€ | x4: 100€ ⚡</div>
                      </div>
                      {options.renov_phare.quantity >= 4 && (
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                          PROMO x4 !
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('renov_phare', Math.max(0, options.renov_phare.quantity - 1))}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-sm"></i>
                      </motion.button>
                      <span className="w-10 text-center font-bold text-gray-800 text-sm bg-gray-100 py-1 rounded-md">{options.renov_phare.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('renov_phare', options.renov_phare.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-md">
                        {calculateOptionPrice(options.renov_phare) > 0 ? `+${calculateOptionPrice(options.renov_phare)}€` : '0€'}
                      </div>
                    </div>
                  </div>

                  {/* Pressing coffre/plafonnier */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-purple-300 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">📦 Pressing coffre/plafonnier</span>
                        <div className="text-xs text-gray-600">Prix fixe: 30€/unité 💼</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_coffre_plafonnier', Math.max(0, options.pressing_coffre_plafonnier.quantity - 1))}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-minus text-sm"></i>
                      </motion.button>
                      <span className="w-10 text-center font-bold text-gray-800 text-sm bg-gray-100 py-1 rounded-md">{options.pressing_coffre_plafonnier.quantity}</span>
                      <motion.button
                        onClick={() => onOptionQuantityChange && onOptionQuantityChange('pressing_coffre_plafonnier', options.pressing_coffre_plafonnier.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bx bx-plus text-sm"></i>
                      </motion.button>
                      <div className="ml-auto font-bold text-purple-600 text-sm bg-purple-50 px-2 py-1 rounded-md">
                        {(options.pressing_coffre_plafonnier.quantity * options.pressing_coffre_plafonnier.prix_unitaire) > 0 ? `+${options.pressing_coffre_plafonnier.quantity * options.pressing_coffre_plafonnier.prix_unitaire}€` : '0€'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Options on/off */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <i className="bx bx-toggle-left text-orange-600"></i>
                    <span>🌟 Services spéciaux</span>
                  </h4>

                  {/* Assaisonnement à l'ozone */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-orange-300 transition-all shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">🌬️ Assaisonnement à l'ozone</span>
                        <div className="text-xs text-gray-600">Durée: 20-25min | Prix: 30€ 🦠</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => onOptionToggle && onOptionToggle('assaisonnement_ozone')}
                          className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                            options.assaisonnement_ozone.selected ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            options.assaisonnement_ozone.selected ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </motion.button>
                        <div className={`font-bold text-sm px-2 py-1 rounded-md ${
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
                className="bg-gradient-to-r from-green-50 to-blue-50 border border-[#FF0000]/20 rounded-lg p-2 mb-3"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <i className="bx bx-receipt text-[#FF0000]"></i>
                  <span className="text-xs sm:text-sm">📋 Récapitulatif</span>
                  {additionalFormules.length > 0 && (
                    <span className="bg-[#FF0000] text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                      {1 + additionalFormules.length}
                    </span>
                  )}
                </h3>
                <div className="space-y-1">
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
                  {options.pressing_coffre_plafonnier.quantity > 0 && (
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
                      <span className="font-medium text-xs sm:text-sm flex-shrink-0 text-purple-600">+{options.lavage_premium.prix}€</span>
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
            <div className="border-t border-gray-200 p-2 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <motion.button
                  onClick={() => onReserveDirectly(selectedFormule)}
                  className="flex-1 px-3 py-3 sm:px-4 sm:py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-bold shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <i className="bx bx-check text-base sm:text-lg"></i>
                    <span className="text-xs sm:text-base">Formule seule</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5 sm:mt-1">
                    {selectedFormule.prix}€
                  </div>
                </motion.button>
                <motion.button
                  onClick={onProceedToReservation}
                  className="flex-1 px-3 py-3 sm:px-4 sm:py-4 bg-gradient-to-r from-[#FF0000] to-[#FF4500] hover:from-[#CC0000] hover:to-[#FF6600] text-white rounded-lg hover:shadow-xl transition-all font-bold shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <i className="bx bx-rocket text-base sm:text-lg"></i>
                    <span className="text-xs sm:text-base">Continuer</span>
                  </div>
                  <div className="text-xs sm:text-sm text-red-100 font-medium mt-0.5 sm:mt-1">
                    Total: {getTotalPrice()}€
                  </div>
                </motion.button>
              </div>
              <div className="mt-1 sm:mt-2 text-center">
                <p className="text-xs text-gray-500">
                  💡 Modifiable avant validation
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FormuleSelectionModal; 
