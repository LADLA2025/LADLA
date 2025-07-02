import React, { useState, useEffect } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../../config/api.js';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FormuleSelectionModal from '../components/FormuleSelectionModal';

function PetiteCitadine() {
  const [formules, setFormules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFormule, setSelectedFormule] = useState(null);
  const [additionalFormules, setAdditionalFormules] = useState([]);

  // Charger les formules au chargement du composant
  useEffect(() => {
    fetchFormules();
  }, []);

  // Fonction pour récupérer les formules
  const fetchFormules = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.PETITE_CITADINE));
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
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedFormule(null);
    setAdditionalFormules([]);
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
    const totalPrice = allFormules.reduce((sum, f) => sum + parseFloat(f.prix), 0);
    
    const params = new URLSearchParams({
      formule: formulesParam,
      type: 'petite-citadine',
      prix_total: totalPrice.toFixed(2)
    });
    
    window.location.href = `/reservation?${params.toString()}`;
  };

  // Fonction pour réserver directement sans formules supplémentaires
  const reserveDirectly = (formule) => {
    const params = new URLSearchParams({
      formule: formule.nom,
      type: 'petite-citadine'
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
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFA600] to-orange-500">
            Formules Petite Citadine
        </h1>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez nos formules spécialement conçues pour les petites citadines
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-[#FFA600]"
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA600]"></div>
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
                    Les formules pour petites citadines ne sont pas encore configurées.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {formules.map((formule, index) => (
                  <motion.div 
                    key={formule.id} 
                    className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105 relative group h-full flex flex-col"
                    variants={itemVariants}
                    custom={index}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Header de la carte - Hauteur fixe */}
                    <div className="p-6 bg-gradient-to-r from-[#FFA600] to-orange-500 flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <i className={`${formule.icone} text-2xl text-[#FFA600]`}></i>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white line-clamp-2">{formule.nom}</h2>
                          <p className="text-orange-100 text-sm">{formule.duree}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contenu de la carte - Prend l'espace restant */}
                    <div className="p-6 relative flex flex-col flex-grow">
                      {/* Services inclus - Espace variable */}
                      <div className="mb-6 flex-grow">
                        <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                          <i className="bx bx-list-check text-[#FFA600]"></i>
                          Services inclus
                        </h3>
                        <ul className="space-y-2 min-h-[120px]">
                          {formule.services.map((service, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <i className="bx bx-check text-[#FFA600] flex-shrink-0 mt-0.5"></i>
                              <span className="text-gray-600 leading-relaxed">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Prix - Hauteur fixe */}
                      <div className="bg-gradient-to-r from-[#FFA600]/10 to-orange-500/10 rounded-xl p-4 text-center border border-[#FFA600]/20 mb-6 flex-shrink-0">
                        <div className="text-3xl font-bold text-[#FFA600] mb-1">
                          {formule.prix}€
                        </div>
                        <p className="text-sm text-gray-500">Prix de la formule</p>
                      </div>

                      {/* Bouton de réservation - Toujours en bas */}
                      <div className="mt-auto">
                        <motion.button
                          onClick={() => openReservationModal(formule)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white rounded-xl hover:from-[#FF9500] hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <i className="bx bx-calendar-plus mr-2"></i>
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Besoin d'aide pour choisir ?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Nos experts sont là pour vous conseiller et vous aider à choisir la formule 
                la plus adaptée à votre petite citadine. N'hésitez pas à nous contacter !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/reservation"
                  className="px-6 py-3 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white rounded-xl hover:shadow-lg transition-shadow inline-flex items-center justify-center gap-2 font-medium"
                >
                  <i className="bx bx-calendar-plus"></i>
                  Faire une réservation
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-transparent border-2 border-[#FFA600] text-[#FFA600] rounded-xl hover:bg-[#FFA600] hover:text-white transition-colors inline-flex items-center justify-center gap-2 font-medium"
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
          vehicleType="petite-citadine"
        />
        </div>
    </div>
  );
}

export default PetiteCitadine; 