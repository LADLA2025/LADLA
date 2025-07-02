import React, { useState, useEffect } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../config/api.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Reservation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formules, setFormules] = useState([]);
  const [loadingFormules, setLoadingFormules] = useState(false);
  const [existingReservations, setExistingReservations] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [formData, setFormData] = useState({
    // Étape 1 - Renseignements
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    
    // Étape 2 - Rendez-vous
    typeVoiture: '',
    marqueVoiture: '',
    formule: '',
    date: '',
    heure: '',
    prixTotal: null,
    
    // Étape 3 - Informations complémentaires
    adresse: '',
    commentaires: '',
    
    // Étape 4 - Validation
    conditions: false,
    newsletter: false
  });

  // Types de véhicules avec IDs uniques
  const typesVehicules = [
    { id: 'pc_001', name: 'petite-citadine', label: 'Petite Citadine' },
    { id: 'ct_002', name: 'citadine', label: 'Citadine' },
    { id: 'bl_003', name: 'berline', label: 'Berline' },
    { id: 'sv_004', name: 'suv', label: 'SUV / 4x4' }
  ];

  // Liste complète des marques de voitures
  const marquesVoitures = [
    'Abarth', 'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 
    'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroën', 'Dacia', 'Daewoo', 
    'Daihatsu', 'Dodge', 'DS', 'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 
    'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'Iveco', 'Jaguar', 'Jeep', 'Kia', 
    'Lada', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 
    'Maserati', 'Maybach', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mercury', 'MG', 
    'Mini', 'Mitsubishi', 'Morgan', 'Nissan', 'Opel', 'Pagani', 'Peugeot', 'Plymouth', 
    'Pontiac', 'Porsche', 'Ram', 'Renault', 'Rolls-Royce', 'Rover', 'Saab', 'Saturn', 
    'Scion', 'Seat', 'Skoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki', 'Tesla', 
    'Toyota', 'Vauxhall', 'Volkswagen', 'Volvo'
  ].sort();

  // Fonction pour récupérer les formules selon le type de véhicule
  const fetchFormules = async (typeVehicule) => {
    if (!typeVehicule) {
      setFormules([]);
      return;
    }

    try {
      setLoadingFormules(true);
      const response = await fetch(buildAPIUrl(`/formules/${typeVehicule}`));
      if (!response.ok) throw new Error('Erreur lors de la récupération des formules');
      const data = await response.json();
      setFormules(data);
    } catch (error) {
      console.error('Erreur:', error);
      setFormules([]);
    } finally {
      setLoadingFormules(false);
    }
  };

  // Fonction pour récupérer les réservations existantes pour une date donnée
  const fetchExistingReservations = async (date) => {
    if (!date) {
      setExistingReservations([]);
      return;
    }

    try {
      setLoadingAvailability(true);
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.RESERVATIONS_BY_DATE}/${date}`));
      if (!response.ok) throw new Error('Erreur lors de la récupération des réservations');
      const result = await response.json();
      
      if (result.success) {
        setExistingReservations(result.data || []);
      } else {
        setExistingReservations([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setExistingReservations([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Fonction pour convertir la durée en minutes (ex: "2h30" -> 150)
  const convertDurationToMinutes = (duration) => {
    if (!duration) return 60; // durée par défaut: 1h
    
    const match = duration.match(/(\d+)h?(\d*)/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
    return 60; // durée par défaut
  };

  // Fonction pour calculer les créneaux occupés
  const getOccupiedSlots = () => {
    const occupied = new Set();
    
    existingReservations.forEach(reservation => {
      const startTime = reservation.heure_rdv;
      const formule = formules.find(f => f.nom === reservation.formule);
      const durationMinutes = formule ? convertDurationToMinutes(formule.duree) : 60;
      
      // Convertir l'heure de début en minutes depuis minuit
      const [hours, minutes] = startTime.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      
      // Calculer tous les créneaux de 30 minutes occupés
      for (let i = 0; i < durationMinutes; i += 30) {
        const slotMinutes = startMinutes + i;
        const slotHours = Math.floor(slotMinutes / 60);
        const slotMins = slotMinutes % 60;
        const slotTime = `${slotHours.toString().padStart(2, '0')}:${slotMins.toString().padStart(2, '0')}`;
        occupied.add(slotTime);
      }
    });
    
    return occupied;
  };

  // Fonction pour vérifier si un créneau est disponible
  const isSlotAvailable = (timeSlot) => {
    if (!formData.date || !formData.formule) return true;
    
    const occupiedSlots = getOccupiedSlots();
    const selectedFormule = formules.find(f => f.nom === formData.formule);
    const durationMinutes = selectedFormule ? convertDurationToMinutes(selectedFormule.duree) : 60;
    
    // Convertir le créneau sélectionné en minutes
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    
    // Vérifier si tous les créneaux nécessaires sont libres
    for (let i = 0; i < durationMinutes; i += 30) {
      const checkMinutes = startMinutes + i;
      const checkHours = Math.floor(checkMinutes / 60);
      const checkMins = checkMinutes % 60;
      const checkTime = `${checkHours.toString().padStart(2, '0')}:${checkMins.toString().padStart(2, '0')}`;
      
      if (occupiedSlots.has(checkTime)) {
        return false;
      }
    }
    
    return true;
  };

  // Récupérer les données de la formule depuis l'URL si disponible
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const formule = searchParams.get('formule');
    const type = searchParams.get('type');
    const prixTotal = searchParams.get('prix_total');
    
    if (formule && type) {
      setFormData(prev => ({
        ...prev,
        formule: formule,
        typeVoiture: type,
        prixTotal: prixTotal ? parseFloat(prixTotal) : null
      }));
      // Charger les formules pour ce type de véhicule
      fetchFormules(type);
    }
  }, [location]);

  // Charger les formules quand le type de véhicule change
  useEffect(() => {
    if (formData.typeVoiture) {
      fetchFormules(formData.typeVoiture);
      // Réinitialiser la formule sélectionnée si le type change
      if (formData.formule) {
        const searchParams = new URLSearchParams(location.search);
        const urlFormule = searchParams.get('formule');
        // Ne réinitialiser que si ce n'est pas la formule de l'URL
        if (!urlFormule || urlFormule !== formData.formule) {
          setFormData(prev => ({ ...prev, formule: '' }));
        }
      }
    }
  }, [formData.typeVoiture]);

  // Charger les réservations existantes quand la date change
  useEffect(() => {
    if (formData.date) {
      fetchExistingReservations(formData.date);
    }
  }, [formData.date]);

  // Recharger les disponibilités quand la formule change
  useEffect(() => {
    if (formData.date && formData.formule) {
      fetchExistingReservations(formData.date);
    }
  }, [formData.formule]);

  const steps = [
    { id: 1, title: 'Renseignement', icon: 'bx-user' },
    { id: 2, title: 'Rendez-vous', icon: 'bx-calendar' },
    { id: 3, title: 'Informations', icon: 'bx-info-circle' },
    { id: 4, title: 'Validation', icon: 'bx-check-circle' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.nom && formData.prenom && formData.email && formData.telephone;
      case 2:
        return formData.typeVoiture && formData.marqueVoiture && formData.formule && formData.date && formData.heure;
      case 3:
        return formData.adresse;
      case 4:
        return formData.conditions;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(4)) {
      try {
        const reservationData = {
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          adresse: formData.adresse,
          typeVoiture: formData.typeVoiture,
          marqueVoiture: formData.marqueVoiture,
          formule: formData.formule,
          prix: getFormulePrice(),
          date: formData.date,
          heure: formData.heure,
          commentaires: formData.commentaires,
          newsletter: formData.newsletter
        };

        console.log('Envoi des données de réservation:', reservationData);

        const response = await fetch(buildAPIUrl(API_ENDPOINTS.RESERVATIONS), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData)
        });

        const result = await response.json();

        if (result.success) {
          alert('Réservation créée avec succès ! Nous vous contacterons bientôt.');
          navigate('/');
        } else {
          alert('Erreur lors de la création de la réservation: ' + result.error);
        }

      } catch (error) {
        console.error('Erreur lors de l\'envoi de la réservation:', error);
        alert('Erreur lors de l\'envoi de la réservation. Veuillez réessayer.');
      }
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      // Ajouter l'heure pleine, sauf 9:00
      if (hour !== 9) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        slots.push({
          time: timeSlot,
          available: isSlotAvailable(timeSlot),
          label: timeSlot
        });
      }
      
      // Ajouter la demi-heure, sauf pendant la pause déjeuner (12h30, 13h00, 13h30)
      if (hour <= 18) {
        const halfHour = `${hour.toString().padStart(2, '0')}:30`;
        // Exclure 12:30 et 13:30 (pause déjeuner)
        if (halfHour !== '12:30' && halfHour !== '13:30') {
          slots.push({
            time: halfHour,
            available: isSlotAvailable(halfHour),
            label: halfHour
          });
        }
      }
    }
    
    // Exclure également 13:00 (pause déjeuner) et retourner les créneaux avec disponibilité
    return slots.filter(slot => slot.time !== '13:00');
  };

  // Fonction pour obtenir le label du type de véhicule
  const getTypeVehiculeLabel = (typeValue) => {
    const type = typesVehicules.find(t => t.name === typeValue);
    return type ? type.label : typeValue;
  };

  // Fonction pour obtenir le prix de la formule sélectionnée
  const getFormulePrice = () => {
    // Si on a un prix total (formules multiples), l'utiliser
    if (formData.prixTotal) {
      return formData.prixTotal;
    }
    
    // Sinon, chercher le prix de la formule simple
    const formule = formules.find(f => f.nom === formData.formule);
    return formule ? formule.prix : null;
  };

  // Fonction pour vérifier si on a des formules multiples
  const hasMultipleFormules = () => {
    return formData.formule && formData.formule.includes(',');
  };

  // Fonction pour obtenir la liste des formules sélectionnées
  const getSelectedFormules = () => {
    if (!formData.formule) return [];
    return formData.formule.split(',').map(nom => nom.trim());
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
    <div className="min-h-screen pt-20 sm:pt-32 pb-6 sm:pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Cercles d'ambiance */}
      <div className="light-circle circle1"></div>
      <div className="light-circle circle2"></div>
      <div className="light-circle circle3"></div>
      <div className="light-circle circle4"></div>
      <div className="light-circle circle5"></div>
      <div className="light-circle circle6"></div>

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-6 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFA600] to-orange-500">
            Réservation
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg mb-4 sm:mb-6 px-4">
            Réservez votre service en quelques étapes simples
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base text-gray-700 hover:text-[#FFA600]"
          >
            <i className="bx bx-arrow-back text-lg"></i>
            Retour à l'accueil
          </Link>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Barre de progression */}
          <motion.div 
            className="mb-6 sm:mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between relative px-2">
              {/* Ligne de progression */}
              <div className="absolute top-5 sm:top-6 left-6 sm:left-0 right-6 sm:right-0 h-0.5 sm:h-1 bg-gray-200 rounded-full z-0">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#FFA600] to-orange-500 rounded-full transition-all duration-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></motion.div>
              </div>

              {/* Étapes */}
              {steps.map((step) => (
                <motion.div 
                  key={step.id} 
                  className="relative z-10 flex flex-col items-center flex-1"
                  variants={itemVariants}
                >
                  <motion.div 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg transition-all duration-300 shadow-lg ${
                      currentStep >= step.id 
                        ? 'bg-gradient-to-r from-[#FFA600] to-orange-500 text-white' 
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentStep > step.id ? (
                      <i className="bx bx-check text-lg sm:text-xl"></i>
                    ) : (
                      step.id
                    )}
                  </motion.div>
                  <span className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-center ${
                    currentStep >= step.id ? 'text-[#FFA600]' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contenu des étapes */}
          <motion.div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-8 relative overflow-hidden group"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <AnimatePresence mode="wait">
                {/* Étape 1 - Renseignements */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">Vos informations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-user mr-2 text-[#FFA600]"></i>
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          placeholder="Tapez votre prénom"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-user mr-2 text-[#FFA600]"></i>
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          placeholder="Tapez votre nom"
                          required
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-envelope mr-2 text-[#FFA600]"></i>
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-phone mr-2 text-[#FFA600]"></i>
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          placeholder="06 XX XX XX XX"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Étape 2 - Rendez-vous */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">Votre rendez-vous</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-car mr-2 text-[#FFA600]"></i>
                          Type de véhicule *
                        </label>
                        <select
                          name="typeVoiture"
                          value={formData.typeVoiture}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          required
                        >
                          <option value="">Sélectionner le type de véhicule</option>
                          {typesVehicules.map(type => (
                            <option key={type.id} value={type.name}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-crown mr-2 text-[#FFA600]"></i>
                          Marque de voiture *
                        </label>
                        <select
                          name="marqueVoiture"
                          value={formData.marqueVoiture}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          required
                        >
                          <option value="">Sélectionner la marque</option>
                          {marquesVoitures.map(marque => (
                            <option key={marque} value={marque}>{marque}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-package mr-2 text-[#FFA600]"></i>
                          Formule *
                        </label>
                        {hasMultipleFormules() ? (
                          <div className="w-full px-4 py-3 rounded-xl border-2 border-[#FFA600] bg-[#FFA600]/5">
                            <div className="flex items-center gap-2 mb-2">
                              <i className="bx bx-check-circle text-[#FFA600]"></i>
                              <span className="font-medium text-gray-700 text-sm sm:text-base">Formules sélectionnées :</span>
                            </div>
                            <div className="space-y-1">
                              {getSelectedFormules().map((formuleNom, index) => (
                                <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                  <i className="bx bx-chevron-right text-[#FFA600]"></i>
                                  {formuleNom}
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              <i className="bx bx-info-circle mr-1"></i>
                              Pour modifier votre sélection, retournez à la page des formules
                            </div>
                          </div>
                        ) : (
                          <select
                            name="formule"
                            value={formData.formule}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                            disabled={!formData.typeVoiture || loadingFormules}
                            required
                          >
                            <option value="">
                              {!formData.typeVoiture 
                                ? "Sélectionnez d'abord un type de véhicule" 
                                : loadingFormules 
                                  ? "Chargement des formules..." 
                                  : "Sélectionner une formule"
                              }
                            </option>
                            {formules.map(formule => (
                              <option key={formule.id} value={formule.nom}>
                                {formule.nom} - {formule.prix}€
                              </option>
                            ))}
                          </select>
                        )}
                        {formData.formule && getFormulePrice() && (
                          <div className="mt-2 p-3 bg-[#FFA600]/10 rounded-lg border border-[#FFA600]/20">
                            <div className="flex items-center gap-2">
                              <i className="bx bx-info-circle text-[#FFA600]"></i>
                              <span className="text-sm font-medium text-gray-700">
                                {hasMultipleFormules() ? 'Prix total des formules' : 'Prix de la formule'} : 
                                <span className="text-[#FFA600] font-bold ml-1">{getFormulePrice()}€</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-calendar mr-2 text-[#FFA600]"></i>
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-time mr-2 text-[#FFA600]"></i>
                          Heure *
                          {loadingAvailability && (
                            <span className="ml-2 text-xs text-gray-500">
                              <i className="bx bx-loader-alt animate-spin"></i>
                              Vérification...
                            </span>
                          )}
                        </label>
                        <select
                          name="heure"
                          value={formData.heure}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          disabled={!formData.date || !formData.formule || loadingAvailability}
                          required
                        >
                          <option value="">
                            {!formData.date 
                              ? "Sélectionnez d'abord une date" 
                              : !formData.formule 
                                ? "Sélectionnez d'abord une formule"
                                : loadingAvailability
                                  ? "Vérification des disponibilités..."
                                  : "Sélectionner l'heure"
                            }
                          </option>
                          {generateTimeSlots().map(slot => (
                            <option 
                              key={slot.time} 
                              value={slot.time}
                              disabled={!slot.available}
                              style={{
                                color: slot.available ? 'inherit' : '#ccc',
                                backgroundColor: slot.available ? 'inherit' : '#f5f5f5'
                              }}
                            >
                              {slot.label} {!slot.available ? '(Indisponible)' : ''}
                            </option>
                          ))}
                        </select>
                        {formData.date && formData.formule && (
                          <div className="mt-2 text-xs text-gray-600">
                            <i className="bx bx-info-circle mr-1"></i>
                            {formData.formule && (
                              <>
                                Durée estimée : {formules.find(f => f.nom === formData.formule)?.duree || '1h'}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3 - Informations complémentaires */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">Informations complémentaires</h2>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-map mr-2 text-[#FFA600]"></i>
                          Adresse *
                        </label>
                        <input
                          type="text"
                          name="adresse"
                          value={formData.adresse}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                          placeholder="Votre adresse complète"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          <i className="bx bx-message-detail mr-2 text-[#FFA600]"></i>
                          Commentaires ou demandes spéciales
                        </label>
                        <textarea
                          name="commentaires"
                          value={formData.commentaires}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-4 py-3 sm:py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors resize-none text-base"
                          placeholder="Précisez vos besoins ou demandes particulières..."
                        ></textarea>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Étape 4 - Validation */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">Récapitulatif</h2>
                    
                    {/* Récapitulatif */}
                    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#FFA600]">Votre réservation</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none">
                          <span className="font-medium text-gray-600">Nom :</span>
                          <span className="text-gray-800 text-right">{formData.prenom} {formData.nom}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none">
                          <span className="font-medium text-gray-600">Email :</span>
                          <span className="text-gray-800 text-right break-all">{formData.email}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none">
                          <span className="font-medium text-gray-600">Téléphone :</span>
                          <span className="text-gray-800 text-right">{formData.telephone}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none">
                          <span className="font-medium text-gray-600">Type véhicule :</span>
                          <span className="text-gray-800 text-right">{getTypeVehiculeLabel(formData.typeVoiture)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none">
                          <span className="font-medium text-gray-600">Marque :</span>
                          <span className="text-gray-800 text-right">{formData.marqueVoiture}</span>
                        </div>
                        <div className="py-1 border-b border-gray-200 sm:border-none col-span-1 sm:col-span-2">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-600">
                              {hasMultipleFormules() ? 'Formules :' : 'Formule :'}
                            </span>
                          </div>
                          {hasMultipleFormules() ? (
                            <div className="ml-0 sm:ml-4 space-y-1">
                              {getSelectedFormules().map((formuleNom, index) => (
                                <div key={index} className="flex items-center gap-2 text-gray-800">
                                  <i className="bx bx-chevron-right text-[#FFA600] text-sm"></i>
                                  <span className="text-sm">{formuleNom}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-800">{formData.formule}</span>
                          )}
                        </div>
                        {getFormulePrice() && (
                          <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none">
                            <span className="font-medium text-gray-600">Prix :</span>
                            <span className="text-[#FFA600] font-bold text-right">{getFormulePrice()}€</span>
                          </div>
                        )}
                        <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none">
                          <span className="font-medium text-gray-600">Date :</span>
                          <span className="text-gray-800 text-right">{formData.date}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none">
                          <span className="font-medium text-gray-600">Heure :</span>
                          <span className="text-gray-800 text-right">{formData.heure}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 sm:border-none col-span-1 sm:col-span-2">
                          <span className="font-medium text-gray-600">Adresse :</span>
                          <span className="text-gray-800 text-right flex-1 ml-2">{formData.adresse}</span>
                        </div>
                      </div>
                      {formData.commentaires && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <span className="font-medium text-gray-600">Commentaires :</span>
                          <p className="text-gray-800 mt-1 text-sm">{formData.commentaires}</p>
                        </div>
                      )}
                    </div>

                    {/* Conditions */}
                    <div className="space-y-3 sm:space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          name="conditions"
                          checked={formData.conditions}
                          onChange={handleInputChange}
                          className="mt-1 w-5 h-5 text-[#FFA600] rounded focus:ring-[#FFA600] focus:ring-2 flex-shrink-0"
                          required
                        />
                        <span className="text-sm text-gray-700">
                          J'accepte les <Link to="/terms" className="text-[#FFA600] hover:underline">conditions générales</Link> et la <Link to="/privacy" className="text-[#FFA600] hover:underline">politique de confidentialité</Link> *
                        </span>
                      </label>
                      
                      <label className="flex items-start gap-3 cursor-pointer p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                          className="mt-1 w-5 h-5 text-[#FFA600] rounded focus:ring-[#FFA600] focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700">
                          Je souhaite recevoir la newsletter avec les offres et actualités
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Boutons de navigation */}
              <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-3 sm:gap-0">
                <motion.button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`w-full sm:w-auto px-6 py-3 sm:py-3 rounded-xl font-medium transition-all text-base ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                  whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
                  whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
                >
                  <i className="bx bx-chevron-left mr-2"></i>
                  Précédent
                </motion.button>

                {currentStep < 4 ? (
                  <motion.button
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className={`w-full sm:w-auto px-8 py-3 sm:py-3 rounded-xl font-medium transition-all text-base ${
                      validateStep(currentStep)
                        ? 'bg-gradient-to-r from-[#FFA600] to-orange-500 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    whileHover={validateStep(currentStep) ? { scale: 1.02 } : {}}
                    whileTap={validateStep(currentStep) ? { scale: 0.98 } : {}}
                  >
                    Suivant
                    <i className="bx bx-chevron-right ml-2"></i>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!validateStep(4)}
                    className={`w-full sm:w-auto px-8 py-3 sm:py-3 rounded-xl font-medium transition-all text-base ${
                      validateStep(4)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    whileHover={validateStep(4) ? { scale: 1.02 } : {}}
                    whileTap={validateStep(4) ? { scale: 0.98 } : {}}
                  >
                    <i className="bx bx-check mr-2"></i>
                    Confirmer
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Newsletter section */}
          <motion.div 
            className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center relative overflow-hidden group"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">La newsletter</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Recevez nos offres spéciales et actualités directement dans votre boîte mail
              </p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3 sm:gap-4">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors text-base"
                />
                <motion.button 
                  className="px-6 py-3 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  S'inscrire
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Reservation; 