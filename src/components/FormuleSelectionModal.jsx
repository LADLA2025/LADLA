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
  vehicleType 
}) {
  if (!selectedFormule) return null;

  const getTotalPrice = () => {
    return (parseFloat(selectedFormule.prix) + additionalFormules.reduce((sum, f) => sum + parseFloat(f.prix), 0)).toFixed(2);
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
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseModal}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-[#FFA600] to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">🎯 Personnalisez votre réservation</h2>
                  <p className="text-orange-100 text-lg">
                    💡 Vous pouvez ajouter d'autres formules {getVehicleTypeLabel()} pour économiser !
                  </p>
                  <p className="text-orange-200 text-sm mt-1">
                    ✨ Cliquez sur les formules ci-dessous pour les ajouter à votre sélection
                  </p>
                </div>
                <motion.button
                  onClick={onCloseModal}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className="bx bx-x text-2xl"></i>
                </motion.button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Formule principale sélectionnée */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FFA600]"></i>
                  Formule principale sélectionnée
                </h3>
                <div className="bg-[#FFA600]/10 border border-[#FFA600]/20 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FFA600] flex items-center justify-center">
                        <i className={`${selectedFormule.icone} text-xl text-white`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{selectedFormule.nom}</h4>
                        <p className="text-sm text-gray-600">{selectedFormule.duree}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#FFA600]">{selectedFormule.prix}€</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formules supplémentaires disponibles */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-[#FFA600]/10 to-orange-500/10 rounded-2xl p-4 border-2 border-dashed border-[#FFA600]/30 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <i className="bx bx-plus-circle text-[#FFA600] animate-pulse"></i>
                    🌟 Formules supplémentaires disponibles
                  </h3>
                  <p className="text-sm text-gray-600">
                    💰 <span className="font-medium text-[#FFA600]">Économisez en combinant plusieurs services !</span> Cliquez pour ajouter/retirer des formules.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formules
                    .filter(formule => formule.id !== selectedFormule.id)
                    .map((formule) => {
                      const isSelected = additionalFormules.find(f => f.id === formule.id);
                      return (
                        <motion.div
                          key={formule.id}
                          className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 transform ${
                            isSelected 
                              ? 'border-[#FFA600] bg-[#FFA600]/10 shadow-lg scale-105' 
                              : 'border-gray-200 hover:border-[#FFA600] hover:bg-[#FFA600]/5 hover:shadow-md'
                          }`}
                          onClick={() => onToggleAdditionalFormule(formule)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected ? 'bg-[#FFA600] text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                <i className={`${formule.icone} text-lg`}></i>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">{formule.nom}</h4>
                                <p className="text-sm text-gray-600">{formule.duree}</p>
                              </div>
                            </div>
                                                         <div className="text-right">
                               <div className="text-lg font-bold text-[#FFA600]">+{formule.prix}€</div>
                               {isSelected ? (
                                 <motion.div 
                                   className="flex items-center gap-1 text-green-600"
                                   initial={{ scale: 0 }}
                                   animate={{ scale: 1 }}
                                   transition={{ type: "spring", stiffness: 300 }}
                                 >
                                   <i className="bx bx-check-circle text-xl"></i>
                                   <span className="text-xs font-medium">Ajouté !</span>
                                 </motion.div>
                               ) : (
                                 <div className="text-xs text-gray-500 font-medium">Cliquez pour ajouter</div>
                               )}
                             </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>

              {/* Récapitulatif */}
              <motion.div 
                className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-[#FFA600]/20 rounded-2xl p-5 mb-6 shadow-lg"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="bx bx-receipt text-[#FFA600]"></i>
                  📋 Récapitulatif de votre sélection
                  {additionalFormules.length > 0 && (
                    <span className="bg-[#FFA600] text-white px-2 py-1 rounded-full text-xs font-bold">
                      {1 + additionalFormules.length} formules
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedFormule.nom}</span>
                    <span className="font-medium">{selectedFormule.prix}€</span>
                  </div>
                  {additionalFormules.map((formule) => (
                    <div key={formule.id} className="flex justify-between">
                      <span className="text-gray-600">{formule.nom}</span>
                      <span className="font-medium">+{formule.prix}€</span>
                    </div>
                  ))}
                  <hr className="my-3 border-[#FFA600]/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">💰 Total à payer</span>
                    <motion.span 
                      className="text-2xl font-bold text-[#FFA600] bg-white px-3 py-1 rounded-lg shadow-md"
                      key={getTotalPrice()}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {getTotalPrice()}€
                    </motion.span>
                  </div>
                  {additionalFormules.length > 0 && (
                    <div className="mt-2 text-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        🎉 Vous avez choisi {additionalFormules.length} formule{additionalFormules.length > 1 ? 's' : ''} supplémentaire{additionalFormules.length > 1 ? 's' : ''} !
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Footer du modal */}
            <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  🤔 <span className="font-medium">Que souhaitez-vous faire ?</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={() => onReserveDirectly(selectedFormule)}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium border-2 border-transparent hover:border-gray-400"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <i className="bx bx-check text-lg"></i>
                    <span>Réserver uniquement</span>
                    <span className="text-xs opacity-75">"{selectedFormule.nom}"</span>
                  </div>
                </motion.button>
                <motion.button
                  onClick={onProceedToReservation}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white rounded-xl hover:shadow-lg transition-all font-medium border-2 border-transparent hover:border-orange-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <i className="bx bx-rocket text-lg"></i>
                    <span>Continuer avec ma sélection</span>
                    <span className="text-xs opacity-90">
                      {additionalFormules.length > 0 
                        ? `${1 + additionalFormules.length} formules - ${getTotalPrice()}€`
                        : `1 formule - ${selectedFormule.prix}€`
                      }
                    </span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FormuleSelectionModal; 