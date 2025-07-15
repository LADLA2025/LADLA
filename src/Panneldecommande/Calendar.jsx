import React, { useState, useEffect } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../config/api.js';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' ou 'month'
  const [reservations, setReservations] = useState([]);
  
  // État pour la version mobile
  const [selectedMobileDate, setSelectedMobileDate] = useState(new Date());

  // État pour les réservations réelles
  const [realReservations, setRealReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // État pour les formules
  const [formules, setFormules] = useState([]);
  const [loadingFormules, setLoadingFormules] = useState(false);

  // État pour le modal de nouvelle réservation
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [newReservationData, setNewReservationData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    type_voiture: '',
    marque_voiture: '',
    formule: '',
    prix: '',
    date_rdv: '',
    heure_rdv: '',
    commentaires: '',
    // Options supplémentaires
    options: {
      baume_sieges: { quantity: 0, prix_unitaire: 20, prix_x4: 60 },
      pressing_sieges: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      pressing_tapis: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      pressing_coffre_plafonnier: { quantity: 0, prix_unitaire: 30 },
      pressing_panneau_porte: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
      renov_phare: { quantity: 0, prix_unitaire: 30, prix_x4: 100 },
      renov_chrome: { selected: false },
      assaisonnement_ozone: { selected: false, prix: 30 },
      lavage_premium: { selected: false, prix: 120, prix_personnalise: 120 },
      polissage: { selected: false },
      lustrage: { selected: false }
    }
  });
  const [submittingReservation, setSubmittingReservation] = useState(false);

  // État pour le modal de suppression par mois
  const [showDeleteMonthModal, setShowDeleteMonthModal] = useState(false);
  const [deleteMonthData, setDeleteMonthData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  const [deletingMonth, setDeletingMonth] = useState(false);

  // Fonction pour récupérer les réservations depuis l'API
  const fetchWeekReservations = async (date) => {
    try {
      setLoadingReservations(true);
      setError(null);
      
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.RESERVATIONS_BY_WEEK}/${dateStr}`));
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réservations');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Transformer les données pour correspondre au format attendu
        const formattedReservations = result.data.map(reservation => {
          // Maintenant que le serveur retourne des dates comme texte, on peut les utiliser directement
          const formattedDate = reservation.date_rdv;
          
          return {
            id: reservation.id,
            date: formattedDate,
            time: reservation.heure_rdv.substring(0, 5), // Format HH:MM
            client: `${reservation.prenom} ${reservation.nom}`,
            service: reservation.formule,
            vehicle: `${reservation.marque_voiture} ${reservation.type_voiture}`,
            vehicleType: reservation.type_voiture, // Ajouter le type de véhicule séparément
            phone: reservation.telephone,
            status: reservation.status,
            email: reservation.email,
            adresse: reservation.adresse,
            commentaires: reservation.commentaires,
            prix: reservation.prix,
            options: reservation.options // Ajouter les options
          };
        });
        
        setRealReservations(formattedReservations);
        setLastUpdate(new Date());
        
        // Debug : afficher les données formatées
        console.log('📅 Réservations formatées pour le calendrier:', formattedReservations);
        
        // Calculer les dates de la semaine pour le debug
        const weekDatesForDebug = getWeekDates(date);
        console.log('🗓️ Dates de la semaine:', weekDatesForDebug.map(d => formatDate(d)));
        
        // Debug détaillé pour chaque réservation
        formattedReservations.forEach(res => {
          console.log(`🔍 Réservation: ${res.client} - Date: ${res.date} - Heure: ${res.time} - Type: ${res.vehicle} (${res.vehicleType})`);
          if (res.options && res.options.lavage_premium && res.options.lavage_premium.selected) {
            console.log(`    💎 Lavage premium activé pour ${res.client} (type véhicule: ${res.vehicleType})`);
          }
        });
      } else {
        throw new Error(result.error || 'Erreur lors de la récupération des réservations');
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      setError(error.message);
      setRealReservations([]); // Réinitialiser en cas d'erreur
    } finally {
      setLoadingReservations(false);
    }
  };

  // Fonction pour récupérer toutes les formules
  const fetchAllFormules = async () => {
    try {
      setLoadingFormules(true);
      const endpoints = [
        { url: API_ENDPOINTS.PETITE_CITADINE, type: 'petite-citadine' },
        { url: API_ENDPOINTS.CITADINE, type: 'citadine' },
        { url: API_ENDPOINTS.BERLINE, type: 'berline' },
        { url: API_ENDPOINTS.SUV, type: 'suv' }
      ];
      
      const promises = endpoints.map(({ url, type }) => 
        fetch(buildAPIUrl(url))
          .then(res => res.json())
          .then(formules => formules.map(formule => ({ ...formule, vehicleType: type })))
      );
      
      const results = await Promise.all(promises);
      const allFormules = results.flat();
      
      // Debug : vérifier les formules récupérées avec leur type
      const formulesWithLavagePremium = allFormules.filter(f => f.lavage_premium && f.lavage_premium_prix);
      console.log('🔍 Formules avec lavage premium configuré:', 
        formulesWithLavagePremium.map(f => ({ nom: f.nom, prix: f.lavage_premium_prix, type: f.vehicleType }))
      );
      
      setFormules(allFormules);
    } catch (error) {
      console.error('Erreur lors de la récupération des formules:', error);
    } finally {
      setLoadingFormules(false);
    }
  };

  // Charger les réservations lors du changement de date
  useEffect(() => {
    fetchWeekReservations(currentDate);
  }, [currentDate]);

  // Charger les formules au démarrage
  useEffect(() => {
    fetchAllFormules();
  }, []);

  // Mettre à jour le prix du lavage premium quand les formules sont chargées
  useEffect(() => {
    if (formules.length > 0) {
      const formuleWithLavagePremium = formules.find(f => f.lavage_premium && f.lavage_premium_prix);
      if (formuleWithLavagePremium) {
        setNewReservationData(prev => ({
          ...prev,
          options: {
            ...prev.options,
            lavage_premium: {
              ...prev.options.lavage_premium,
              prix: formuleWithLavagePremium.lavage_premium_prix,
              prix_personnalise: formuleWithLavagePremium.lavage_premium_prix
            }
          }
        }));
      }
    }
  }, [formules]);

  // Synchroniser la date mobile sélectionnée avec la semaine courante
  useEffect(() => {
    const weekDates = getWeekDates(currentDate);
    // Si la date mobile sélectionnée n'est pas dans la semaine courante, la réinitialiser
    const selectedMobileDateStr = formatDate(selectedMobileDate);
    const isInCurrentWeek = weekDates.some(date => formatDate(date) === selectedMobileDateStr);
    
    if (!isInCurrentWeek) {
      setSelectedMobileDate(new Date());
    }
  }, [currentDate, selectedMobileDate]);

  // Auto-rafraîchissement des réservations toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeekReservations(currentDate);
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [currentDate]);

  // Fonction pour mettre à jour le statut d'une réservation
  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.RESERVATIONS}/${reservationId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        // Recharger les réservations
        await fetchWeekReservations(currentDate);
        alert('Statut mis à jour avec succès !');
      } else {
        alert('Erreur lors de la mise à jour : ' + result.error);
      }

    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Fonction pour supprimer une réservation
  const deleteReservation = async (reservationId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.RESERVATIONS}/${reservationId}`), {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        // Recharger les réservations
        await fetchWeekReservations(currentDate);
        setSelectedTimeSlot(null); // Désélectionner le créneau
        alert('Réservation supprimée avec succès !');
      } else {
        alert('Erreur lors de la suppression : ' + result.error);
      }

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la réservation');
    }
  };

  // Fonction pour créer une nouvelle réservation
  const createNewReservation = async (e) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!newReservationData.prenom || !newReservationData.nom || !newReservationData.email || 
        !newReservationData.telephone || !newReservationData.adresse || !newReservationData.type_voiture || 
        !newReservationData.marque_voiture || !newReservationData.formule || !newReservationData.date_rdv || 
        !newReservationData.heure_rdv) {
      alert('Veuillez remplir tous les champs obligatoires (marqués d\'un *)');
      return;
    }

    try {
      setSubmittingReservation(true);

      // Calculer le prix total avec options
      const basePrice = parseFloat(newReservationData.prix) || 0;
      const optionsPrice = calculateTotalOptionsPrice();
      const totalPrice = basePrice + optionsPrice;

      // Construire la description des options pour les commentaires
      const optionsDescription = [];
      const options = newReservationData.options;

      if (options.baume_sieges.quantity > 0) {
        optionsDescription.push(`Baume sièges x${options.baume_sieges.quantity} (${calculateOptionPrice(options.baume_sieges)}€)`);
      }
      if (options.pressing_sieges.quantity > 0) {
        optionsDescription.push(`Pressing sièges x${options.pressing_sieges.quantity} (${calculateOptionPrice(options.pressing_sieges)}€)`);
      }
      if (options.pressing_tapis.quantity > 0) {
        optionsDescription.push(`Pressing tapis x${options.pressing_tapis.quantity} (${calculateOptionPrice(options.pressing_tapis)}€)`);
      }
      if (options.pressing_coffre_plafonnier.quantity > 0) {
        optionsDescription.push(`Pressing coffre/plafonnier x${options.pressing_coffre_plafonnier.quantity} (${options.pressing_coffre_plafonnier.quantity * options.pressing_coffre_plafonnier.prix_unitaire}€)`);
      }
      if (options.pressing_panneau_porte.quantity > 0) {
        optionsDescription.push(`Pressing panneau porte x${options.pressing_panneau_porte.quantity} (${calculateOptionPrice(options.pressing_panneau_porte)}€)`);
      }
      if (options.renov_phare.quantity > 0) {
        optionsDescription.push(`Renov phare x${options.renov_phare.quantity} (${calculateOptionPrice(options.renov_phare)}€)`);
      }
      if (options.renov_chrome.selected) {
        optionsDescription.push('Renov chrome (sur devis)');
      }
      if (options.assaisonnement_ozone.selected) {
        optionsDescription.push(`Assaisonnement ozone (${options.assaisonnement_ozone.prix}€)`);
      }
      if (options.polissage.selected) {
        optionsDescription.push('Polissage (sur devis)');
      }
      if (options.lustrage.selected) {
        optionsDescription.push('Lustrage (sur devis)');
      }

      const fullCommentaires = [
        newReservationData.commentaires || '',
        optionsDescription.length > 0 ? `Options: ${optionsDescription.join(', ')}` : ''
      ].filter(Boolean).join('\n');

      // Transformer les données pour correspondre au format attendu par le serveur
      const serverData = {
        prenom: newReservationData.prenom,
        nom: newReservationData.nom,
        email: newReservationData.email,
        telephone: newReservationData.telephone,
        adresse: newReservationData.adresse,
        typeVoiture: newReservationData.type_voiture,
        marqueVoiture: newReservationData.marque_voiture,
        formule: newReservationData.formule,
        prix: totalPrice,
        date: newReservationData.date_rdv,
        heure: newReservationData.heure_rdv,
        commentaires: fullCommentaires,
        newsletter: false
      };

      console.log('📤 Envoi des données au serveur:', serverData);

      const response = await fetch(buildAPIUrl(API_ENDPOINTS.RESERVATIONS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData)
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Réservation créée avec succès, envoi des emails...');
        
        // Préparer les données complètes pour l'envoi d'emails
        const reservationDataForEmail = {
          ...serverData,
          options: newReservationData.options
        };
        
        // Envoyer les emails via EmailJS côté client
        try {
          const emailResult = await emailClientService.sendReservationEmails(reservationDataForEmail);
          if (emailResult.success) {
            console.log('📧 Emails envoyés avec succès via EmailJS !');
          } else {
            console.warn('⚠️ Erreur lors de l\'envoi des emails:', emailResult.error);
          }
        } catch (emailError) {
          console.error('❌ Erreur lors de l\'envoi des emails:', emailError);
        }
        
        // Recharger les réservations
        await fetchWeekReservations(currentDate);
        // Réinitialiser le formulaire et fermer le modal
        resetNewReservationForm();
        setShowNewReservationModal(false);
        alert('Réservation créée avec succès ! Les emails de confirmation ont été envoyés.');
      } else {
        alert('Erreur lors de la création : ' + (result.error || 'Erreur inconnue'));
      }

    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert('Erreur lors de la création de la réservation');
    } finally {
      setSubmittingReservation(false);
    }
  };

  // Fonction pour réinitialiser le formulaire de nouvelle réservation
  const resetNewReservationForm = () => {
    const defaultLavagePremiumPrice = (() => {
      if (formules && formules.length > 0) {
        const formuleWithLavagePremium = formules.find(f => f.lavage_premium && f.lavage_premium_prix);
        if (formuleWithLavagePremium) {
          return formuleWithLavagePremium.lavage_premium_prix;
        }
      }
      return 120;
    })();
    
    setNewReservationData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      type_voiture: '',
      marque_voiture: '',
      formule: '',
      prix: '',
      date_rdv: '',
      heure_rdv: '',
      commentaires: '',
      // Options supplémentaires
      options: {
        baume_sieges: { quantity: 0, prix_unitaire: 20, prix_x4: 60 },
        pressing_sieges: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
        pressing_tapis: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
        pressing_coffre_plafonnier: { quantity: 0, prix_unitaire: 30 },
        pressing_panneau_porte: { quantity: 0, prix_unitaire: 30, prix_x4: 75 },
        renov_phare: { quantity: 0, prix_unitaire: 30, prix_x4: 100 },
        renov_chrome: { selected: false },
        assaisonnement_ozone: { selected: false, prix: 30 },
        lavage_premium: { selected: false, prix: defaultLavagePremiumPrice, prix_personnalise: defaultLavagePremiumPrice },
        polissage: { selected: false },
        lustrage: { selected: false }
      }
    });
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleNewReservationChange = (e) => {
    const { name, value } = e.target;
    setNewReservationData(prev => ({
      ...prev,
      [name]: value
    }));
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
    const options = newReservationData.options;
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

    if (options.lavage_premium.selected) {
      // Chercher la formule sélectionnée pour récupérer son prix lavage premium
      const selectedFormule = formules.find(f => f.nom === newReservationData.formule);
      const lavagePremiumPrice = selectedFormule?.lavage_premium_prix || options.lavage_premium.prix_personnalise || options.lavage_premium.prix;
      total += lavagePremiumPrice;
    }

    return total;
  };

  // Fonction pour gérer les changements d'options
  const handleOptionQuantityChange = (optionName, quantity) => {
    setNewReservationData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionName]: {
          ...prev.options[optionName],
          quantity: Math.max(0, parseInt(quantity) || 0)
        }
      }
    }));
  };

  // Fonction pour gérer les options on/off
  const handleOptionToggle = (optionName) => {
    setNewReservationData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionName]: {
          ...prev.options[optionName],
          selected: !prev.options[optionName].selected
        }
      }
    }));
  };

  // Fonction pour gérer le changement de prix personnalisé du lavage premium
  const handleLavagePremiumPriceChange = (price) => {
    const defaultPrice = (() => {
      // Chercher le prix depuis les formules si disponible
      if (formules && formules.length > 0) {
        const formuleWithLavagePremium = formules.find(f => f.lavage_premium && f.lavage_premium_prix);
        if (formuleWithLavagePremium) {
          return formuleWithLavagePremium.lavage_premium_prix;
        }
      }
      return 120; // Fallback
    })();
    
    setNewReservationData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        lavage_premium: {
          ...prev.options.lavage_premium,
          prix_personnalise: parseFloat(price) || defaultPrice
        }
      }
    }));
  };

  // Fonction pour ouvrir le modal avec une date/heure pré-remplie
  const openNewReservationModal = (prefilledDate = null, prefilledTime = null) => {
    if (prefilledDate) {
      setNewReservationData(prev => ({
        ...prev,
        date_rdv: prefilledDate,
        heure_rdv: prefilledTime || ''
      }));
    }
    setShowNewReservationModal(true);
  };

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const weekDaysShort = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Générer les créneaux horaires (9h30 - 18h30 avec pause déjeuner)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      // Ajouter l'heure pleine, sauf 9:00
      if (hour !== 9) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      
      // Ajouter la demi-heure, sauf pendant la pause déjeuner (12h30, 13h00, 13h30)
      if (hour <= 18) {
        const halfHour = `${hour.toString().padStart(2, '0')}:30`;
        // Exclure 12:30 et 13:30 (pause déjeuner)
        if (halfHour !== '12:30' && halfHour !== '13:30') {
          slots.push(halfHour);
        }
      }
    }
    
    // Exclure également 13:00 (pause déjeuner)
    return slots.filter(slot => slot !== '13:00');
  };

  const getWeekDates = (date) => {
    const currentDay = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Distance du lundi
    
    const monday = new Date(date);
    monday.setDate(date.getDate() - daysFromMonday);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(monday);
      dateObj.setDate(monday.getDate() + i);
      dates.push(dateObj);
    }
    return dates;
  };

  const formatDate = (date) => {
    // Utiliser la date locale plutôt qu'UTC pour éviter les décalages de timezone
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getReservationForTimeSlot = (date, timeSlot) => {
    const dateStr = formatDate(date);
    const reservation = realReservations.find(res => res.date === dateStr && res.time === timeSlot);
    
    // Debug : afficher les tentatives de matching (seulement pour les créneaux avec réservations potentielles)
    if (realReservations.length > 0 && !reservation && realReservations.some(r => r.date === dateStr)) {
      console.log(`🔍 Recherche réservation pour ${dateStr} à ${timeSlot}`);
      console.log('📋 Réservations disponibles pour cette date:', realReservations.filter(r => r.date === dateStr).map(r => `${r.time} (${r.client})`));
    }
    
    return reservation;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction * 7));
      return newDate;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSelectedReservation = () => {
    if (!selectedTimeSlot) return null;
    const [dateStr, timeStr] = selectedTimeSlot.split('-');
    return realReservations.find(res => res.date === dateStr && res.time === timeStr);
  };

  // Fonction pour afficher les options de manière formatée
  // Fonction pour trouver le prix personnalisé du lavage premium selon le type de véhicule
  const findLavagePremiumPrice = (vehicleType) => {
    console.log('🔍 findLavagePremiumPrice appelé avec:', vehicleType);
    console.log('🔍 Formules disponibles:', formules.length);
    
    if (!formules || formules.length === 0) {
      console.log('❌ Aucune formule disponible');
      return 120;
    }
    
    // Afficher toutes les formules avec lavage premium pour debug
    const formulesWithLavagePremium = formules.filter(f => f.lavage_premium && f.lavage_premium_prix);
    console.log('🔍 Formules avec lavage premium disponibles:', formulesWithLavagePremium.map(f => ({ nom: f.nom, prix: f.lavage_premium_prix })));
    
    // Mapping des types de véhicules vers les formules
    const vehicleTypeMap = {
      'petite-citadine': ['petite-citadine', 'petite citadine', 'petite_citadine'],
      'citadine': ['citadine'],
      'berline': ['berline'],
      'suv': ['suv', 'suv 4x4', '4x4', 'suv_4x4']
    };
    
    // Identifier le type de véhicule
    let targetVehicleType = null;
    if (vehicleType) {
      const lowerVehicleType = vehicleType.toLowerCase();
      console.log('🔍 Type de véhicule en lowercase:', lowerVehicleType);
      
      for (const [key, values] of Object.entries(vehicleTypeMap)) {
        console.log(`🔍 Vérification ${key}:`, values, '→', values.some(v => lowerVehicleType.includes(v)));
        if (values.some(v => lowerVehicleType.includes(v))) {
          targetVehicleType = key;
          break;
        }
      }
    }
    
    console.log('🔍 Type de véhicule détecté:', vehicleType, '→', targetVehicleType);
    
    // Chercher la formule correspondante avec lavage premium
    const matchingFormules = formules.filter(f => {
      if (!f.lavage_premium || !f.lavage_premium_prix) return false;
      
      // Vérifier si la formule correspond au type de véhicule
      const formuleName = f.nom.toLowerCase();
      console.log('🔍 Vérification formule:', f.nom, 'avec prix:', f.lavage_premium_prix);
      
      if (targetVehicleType) {
        const matches = vehicleTypeMap[targetVehicleType].some(v => formuleName.includes(v));
        console.log(`🔍 Formule "${f.nom}" correspond au type "${targetVehicleType}" ?`, matches);
        return matches;
      }
      return false;
    });
    
    console.log('🔍 Formules correspondantes trouvées:', matchingFormules);
    
    if (matchingFormules.length > 0) {
      // Prendre la première formule correspondante
      const selectedFormule = matchingFormules[0];
      console.log('✅ Prix personnalisé trouvé:', selectedFormule.lavage_premium_prix, 'pour', selectedFormule.nom);
      return selectedFormule.lavage_premium_prix;
    }
    
    // Fallback: chercher n'importe quelle formule avec lavage premium
    const anyFormuleWithLavagePremium = formules.find(f => f.lavage_premium && f.lavage_premium_prix);
    if (anyFormuleWithLavagePremium) {
      console.log('🔍 Prix de fallback trouvé:', anyFormuleWithLavagePremium.lavage_premium_prix, 'depuis', anyFormuleWithLavagePremium.nom);
      return anyFormuleWithLavagePremium.lavage_premium_prix;
    }
    
    console.log('❌ Aucun prix personnalisé trouvé, utilisation du prix par défaut: 120');
    return 120;
  };

  const renderOptions = (options, vehicleType = null) => {
    if (!options || typeof options !== 'object') return null;

    const optionsToShow = [];

    // Options avec quantité et réduction x4
    if (options.baume_sieges?.quantity > 0) {
      const qty = options.baume_sieges.quantity;
      const price = qty >= 4 ? options.baume_sieges.prix_x4 : qty * options.baume_sieges.prix_unitaire;
      optionsToShow.push({
        name: `Baume sièges (x${qty})`,
        price: `${parseFloat(price).toFixed(0)}€`,
        hasReduction: qty >= 4
      });
    }

    if (options.pressing_sieges?.quantity > 0) {
      const qty = options.pressing_sieges.quantity;
      const price = qty >= 4 ? options.pressing_sieges.prix_x4 : qty * options.pressing_sieges.prix_unitaire;
      optionsToShow.push({
        name: `Pressing sièges (x${qty})`,
        price: `${parseFloat(price).toFixed(0)}€`,
        hasReduction: qty >= 4
      });
    }

    if (options.pressing_tapis?.quantity > 0) {
      const qty = options.pressing_tapis.quantity;
      const price = qty >= 4 ? options.pressing_tapis.prix_x4 : qty * options.pressing_tapis.prix_unitaire;
      optionsToShow.push({
        name: `Pressing tapis (x${qty})`,
        price: `${parseFloat(price).toFixed(0)}€`,
        hasReduction: qty >= 4
      });
    }

    if (options.pressing_panneau_porte?.quantity > 0) {
      const qty = options.pressing_panneau_porte.quantity;
      const price = qty >= 4 ? options.pressing_panneau_porte.prix_x4 : qty * options.pressing_panneau_porte.prix_unitaire;
      optionsToShow.push({
        name: `Pressing panneaux (x${qty})`,
        price: `${parseFloat(price).toFixed(0)}€`,
        hasReduction: qty >= 4
      });
    }

    if (options.renov_phare?.quantity > 0) {
      const qty = options.renov_phare.quantity;
      const price = qty >= 4 ? options.renov_phare.prix_x4 : qty * options.renov_phare.prix_unitaire;
      optionsToShow.push({
        name: `Renov phare (x${qty})`,
        price: `${parseFloat(price).toFixed(0)}€`,
        hasReduction: qty >= 4
      });
    }

    if (options.pressing_coffre_plafonnier?.quantity > 0) {
      const qty = options.pressing_coffre_plafonnier.quantity;
      const price = qty * options.pressing_coffre_plafonnier.prix_unitaire;
      optionsToShow.push({
        name: `Pressing coffre/plafonnier (x${qty})`,
        price: `${parseFloat(price).toFixed(0)}€`,
        hasReduction: false
      });
    }

    // Options à prix fixe
    if (options.assaisonnement_ozone?.selected) {
      optionsToShow.push({
        name: 'Assaisonnement ozone',
        price: `${parseFloat(options.assaisonnement_ozone.prix).toFixed(0)}€`,
        hasReduction: false
      });
    }

    if (options.lavage_premium?.selected) {
      // PRIORITÉ 1: Prix personnalisé des formules (toujours le plus récent)
      let lavagePremiumPrice = findLavagePremiumPrice(vehicleType);
      
      // PRIORITÉ 2: Prix de la réservation seulement si aucun prix personnalisé n'est trouvé
      if (lavagePremiumPrice === 120) {
        // Seulement si on n'a pas trouvé de prix personnalisé, utiliser le prix de la réservation
        if (options.lavage_premium.prix_personnalise && options.lavage_premium.prix_personnalise > 0) {
          lavagePremiumPrice = options.lavage_premium.prix_personnalise;
          console.log('🔍 Utilisation du prix de la réservation (prix_personnalise):', lavagePremiumPrice);
        } else if (options.lavage_premium.prix && options.lavage_premium.prix > 0) {
          lavagePremiumPrice = options.lavage_premium.prix;
          console.log('🔍 Utilisation du prix de la réservation (prix):', lavagePremiumPrice);
        }
      }
      
      console.log('🔍 Prix final utilisé pour', vehicleType, ':', lavagePremiumPrice);
      
      optionsToShow.push({
        name: '💎 Lavage Premium',
        price: `${parseFloat(lavagePremiumPrice).toFixed(0)}€`,
        hasReduction: false
      });
    }

    // Options sur devis
    if (options.renov_chrome?.selected) {
      optionsToShow.push({
        name: 'Renov chrome',
        price: 'Sur devis',
        hasReduction: false
      });
    }

    if (options.polissage?.selected) {
      optionsToShow.push({
        name: 'Polissage',
        price: 'Sur devis',
        hasReduction: false
      });
    }

    if (options.lustrage?.selected) {
      optionsToShow.push({
        name: 'Lustrage',
        price: 'Sur devis',
        hasReduction: false
      });
    }

    return optionsToShow;
  };



  // Fonction pour exporter les contacts des utilisateurs en PDF
  const exportContactsToPDF = () => {
    try {
      if (realReservations.length === 0) {
        alert('Aucune réservation à exporter');
        return;
      }

      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      let yPosition = 20;

      // Titre du document
      pdf.setFontSize(18);
      pdf.text('LADL - Contacts Clients', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.text(`Semaine du ${getWeekDates(currentDate)[0].toLocaleDateString('fr-FR')} au ${getWeekDates(currentDate)[6].toLocaleDateString('fr-FR')}`, 20, yPosition);
      yPosition += 10;

      pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, yPosition);
      yPosition += 15;

      // En-têtes du tableau
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text('Client', 20, yPosition);
      pdf.text('Téléphone', 80, yPosition);
      pdf.text('Email', 120, yPosition);
      pdf.text('Date/Heure', 20, yPosition + 5);
      pdf.text('Service', 80, yPosition + 5);
      pdf.text('Véhicule', 120, yPosition + 5);
      yPosition += 15;

      // Ligne de séparation
      pdf.line(20, yPosition - 2, 190, yPosition - 2);
      
      pdf.setFont(undefined, 'normal');

      // Trier les réservations par date/heure
      const sortedReservations = [...realReservations].sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}:00`);
        const dateTimeB = new Date(`${b.date}T${b.time}:00`);
        return dateTimeA - dateTimeB;
      });

      sortedReservations.forEach((reservation, index) => {
        // Vérifier si on a besoin d'une nouvelle page
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
          
          // Répéter les en-têtes sur la nouvelle page
          pdf.setFont(undefined, 'bold');
          pdf.text('Client', 20, yPosition);
          pdf.text('Téléphone', 80, yPosition);
          pdf.text('Email', 120, yPosition);
          pdf.text('Date/Heure', 20, yPosition + 5);
          pdf.text('Service', 80, yPosition + 5);
          pdf.text('Véhicule', 120, yPosition + 5);
          yPosition += 15;
          pdf.line(20, yPosition - 2, 190, yPosition - 2);
          pdf.setFont(undefined, 'normal');
        }

        // Informations client
        pdf.text(reservation.client, 20, yPosition);
        pdf.text(reservation.phone, 80, yPosition);
        pdf.text(reservation.email || 'N/A', 120, yPosition);
        
        // Informations rendez-vous
        const dateFormatted = new Date(reservation.date).toLocaleDateString('fr-FR');
        pdf.text(`${dateFormatted} ${reservation.time}`, 20, yPosition + 5);
        pdf.text(reservation.service.substring(0, 25) + (reservation.service.length > 25 ? '...' : ''), 80, yPosition + 5);
        pdf.text(reservation.vehicle.substring(0, 20) + (reservation.vehicle.length > 20 ? '...' : ''), 120, yPosition + 5);

        // Adresse (si disponible)
        if (reservation.adresse) {
          yPosition += 5;
          pdf.setFontSize(8);
          pdf.setTextColor(100);
          pdf.text(`Adresse: ${reservation.adresse.substring(0, 60)}${reservation.adresse.length > 60 ? '...' : ''}`, 20, yPosition + 5);
          pdf.setFontSize(10);
          pdf.setTextColor(0);
        }

        // Prix et statut
        yPosition += 5;
        pdf.setFontSize(8);
        pdf.text(`Prix: ${reservation.prix ? reservation.prix + '€' : 'N/A'}`, 20, yPosition + 5);
        pdf.text(`Statut: ${reservation.status === 'confirmed' ? 'Confirmé' : 
                              reservation.status === 'pending' ? 'En attente' : 
                              reservation.status === 'cancelled' ? 'Annulé' : 'Terminé'}`, 80, yPosition + 5);
        pdf.setFontSize(10);

        yPosition += 15;

        // Ligne de séparation entre les réservations
        if (index < sortedReservations.length - 1) {
          pdf.setDrawColor(200);
          pdf.line(20, yPosition - 2, 190, yPosition - 2);
          pdf.setDrawColor(0);
        }
      });

      // Résumé en bas de la dernière page
      yPosition += 10;
      pdf.setFont(undefined, 'bold');
      pdf.text('RÉSUMÉ:', 20, yPosition);
      yPosition += 8;
      pdf.setFont(undefined, 'normal');
      pdf.text(`Total réservations: ${realReservations.length}`, 20, yPosition);
      pdf.text(`Confirmées: ${realReservations.filter(r => r.status === 'confirmed').length}`, 20, yPosition + 5);
      pdf.text(`En attente: ${realReservations.filter(r => r.status === 'pending').length}`, 20, yPosition + 10);
      pdf.text(`Chiffre d'affaires: ${realReservations.reduce((total, r) => total + (parseFloat(r.prix) || 0), 0).toFixed(2)}€`, 20, yPosition + 15);

      pdf.save(`contacts-LADL-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF des contacts:', error);
      alert('Erreur lors de l\'export des contacts en PDF');
    }
  };

  // Variables nécessaires pour le rendu
  const timeSlots = generateTimeSlots();
  const weekDates = getWeekDates(currentDate);

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

  // Fonction pour supprimer toutes les réservations d'un mois
  const deleteReservationsByMonth = async () => {
    try {
      setDeletingMonth(true);

      const response = await fetch(
        buildAPIUrl(`${API_ENDPOINTS.DELETE_RESERVATIONS_BY_MONTH}/${deleteMonthData.year}/${deleteMonthData.month}`),
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const result = await response.json();

      if (result.success) {
        // Recharger les réservations
        await fetchWeekReservations(currentDate);
        setShowDeleteMonthModal(false);
        
        if (result.deletedCount > 0) {
          alert(`✅ ${result.deletedCount} réservation(s) supprimée(s) pour ${deleteMonthData.month}/${deleteMonthData.year}`);
        } else {
          alert(`ℹ️ Aucune réservation trouvée pour ${deleteMonthData.month}/${deleteMonthData.year}`);
        }
      } else {
        alert('❌ Erreur lors de la suppression : ' + (result.error || 'Erreur inconnue'));
      }

    } catch (error) {
      console.error('Erreur lors de la suppression par mois:', error);
      alert('❌ Erreur lors de la suppression des réservations');
    } finally {
      setDeletingMonth(false);
    }
  };

  // Fonction pour ouvrir le modal de suppression par mois
  const openDeleteMonthModal = () => {
    const currentWeekDate = getWeekDates(currentDate)[0];
    setDeleteMonthData({
      year: currentWeekDate.getFullYear(),
      month: currentWeekDate.getMonth() + 1
    });
    setShowDeleteMonthModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-full mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Planning des Réservations</h1>
          <p className="text-sm md:text-base text-gray-600">Visualisez votre planning hebdomadaire avec créneaux horaires</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 md:gap-8">
          {/* Planning principal - Pleine largeur sur mobile/tablette, élargi sur desktop */}
          <motion.div variants={itemVariants} className="xl:col-span-4">
            <div className="mb-6">
              {/* Navigation de semaine */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <motion.button
                  onClick={() => navigateWeek(-1)}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-lg w-full sm:w-auto justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bx bx-chevron-left"></i>
                  <span className="hidden sm:inline">Semaine précédente</span>
                  <span className="sm:hidden">Précédente</span>
                </motion.button>
                
                <h2 className="text-lg md:text-2xl font-bold text-gray-800 text-center">
                  <span className="hidden md:inline">
                    Semaine du {getWeekDates(currentDate)[0].getDate()} {months[getWeekDates(currentDate)[0].getMonth()]} {getWeekDates(currentDate)[0].getFullYear()}
                  </span>
                  <span className="md:hidden">
                    {getWeekDates(currentDate)[0].getDate()}/{getWeekDates(currentDate)[0].getMonth() + 1} - {getWeekDates(currentDate)[6].getDate()}/{getWeekDates(currentDate)[6].getMonth() + 1}
                  </span>
                </h2>
                
                <motion.button
                  onClick={() => navigateWeek(1)}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-lg w-full sm:w-auto justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="hidden sm:inline">Semaine suivante</span>
                  <span className="sm:hidden">Suivante</span>
                  <i className="bx bx-chevron-right"></i>
                </motion.button>
              </div>

              {/* Bouton pour aujourd'hui */}
              <div className="mb-6 flex justify-center sm:justify-start">
                <motion.button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 md:px-6 py-2 md:py-3 bg-[#FFA600] text-white rounded-lg hover:bg-[#FF9500] transition-colors text-sm md:text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bx bx-calendar-check mr-2"></i>
                  Aujourd'hui
                </motion.button>
              </div>
            </div>

            {/* Version Desktop - Calendrier complet */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* En-tête avec les jours - Plus grand */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <div className="grid grid-cols-8 gap-0">
                  {/* Colonne vide pour aligner avec les heures */}
                  <div className="p-6 border-r border-gray-300">
                    <div className="text-lg font-bold text-gray-700">Heures</div>
                  </div>
                  
                  {/* Colonnes des jours - Plus grandes */}
                  {weekDates.map((date, index) => (
                    <div key={index} className={`p-6 text-center border-r border-gray-300 last:border-r-0 ${
                      isToday(date) ? 'bg-gradient-to-br from-[#FFA600] to-orange-500 text-white' : ''
                    }`}>
                      <div className="text-base font-bold">
                        {weekDaysShort[index]}
                      </div>
                      <div className={`text-2xl font-black mt-1 ${isToday(date) ? 'text-white' : 'text-gray-800'}`}>
                        {date.getDate()}
                      </div>
                      <div className={`text-sm font-medium mt-1 ${isToday(date) ? 'text-orange-100' : 'text-gray-500'}`}>
                        {months[date.getMonth()].substring(0, 3)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grille des créneaux horaires - Plus grande */}
              <div className="max-h-[600px] overflow-y-auto">
                {timeSlots.map(timeSlot => (
                  <div key={timeSlot} className="grid grid-cols-8 gap-0 border-b border-gray-200 hover:bg-gray-50">
                    {/* Colonne des heures - Plus grande */}
                    <div className="p-4 border-r border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="text-lg font-mono font-bold text-gray-700">
                        {timeSlot}
                      </div>
                    </div>
                    
                    {/* Colonnes des jours - Plus grandes */}
                    {weekDates.map((date, dayIndex) => {
                      const reservation = getReservationForTimeSlot(date, timeSlot);
                      const cellKey = `${formatDate(date)}-${timeSlot}`;
                      const isSelected = selectedTimeSlot === cellKey;

                      return (
                        <motion.div
                          key={dayIndex}
                          className={`p-4 border-r border-gray-300 last:border-r-0 cursor-pointer transition-all duration-200 min-h-[80px] flex flex-col justify-center ${
                            reservation
                              ? `${getStatusColor(reservation.status)} border-opacity-50`
                              : isSelected
                                ? 'bg-blue-50 border-blue-300 border-2'
                                : 'hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            if (!reservation) {
                              // Si pas de réservation, ouvrir le modal avec date/heure pré-remplies
                              openNewReservationModal(formatDate(date), timeSlot);
                            } else {
                              setSelectedTimeSlot(cellKey);
                            }
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {reservation ? (
                            <div className="text-sm">
                              <div className="font-bold truncate text-gray-800 mb-1">{reservation.client}</div>
                              <div className="text-gray-600 truncate text-xs mb-2">{reservation.service}</div>
                              <div className="text-sm text-gray-600 truncate mb-2">{reservation.vehicle}</div>
                              
                              {/* Affichage des options si elles existent */}
                              {reservation.options && Object.keys(reservation.options).some(key => {
                                const option = reservation.options[key];
                                return (option.quantity > 0) || (option.selected === true);
                              }) && (
                                <div className="mb-2">
                                  <div className="text-xs text-blue-600 font-medium mb-1">📦 Options:</div>
                                  <div className="space-y-1">
                                    {reservation.options.baume_sieges?.quantity > 0 && (
                                      <div className="text-xs text-gray-600">💺 Baume sièges x{reservation.options.baume_sieges.quantity}</div>
                                    )}
                                    {reservation.options.pressing_sieges?.quantity > 0 && (
                                      <div className="text-xs text-gray-600">🪑 Pressing sièges x{reservation.options.pressing_sieges.quantity}</div>
                                    )}
                                    {reservation.options.pressing_tapis?.quantity > 0 && (
                                      <div className="text-xs text-gray-600">🎯 Pressing tapis x{reservation.options.pressing_tapis.quantity}</div>
                                    )}
                                    {reservation.options.pressing_panneau_porte?.quantity > 0 && (
                                      <div className="text-xs text-gray-600">🚪 Pressing porte x{reservation.options.pressing_panneau_porte.quantity}</div>
                                    )}
                                    {reservation.options.renov_phare?.quantity > 0 && (
                                      <div className="text-xs text-gray-600">💡 Renov phare x{reservation.options.renov_phare.quantity}</div>
                                    )}
                                    {reservation.options.pressing_coffre_plafonnier?.quantity > 0 && (
                                      <div className="text-xs text-gray-600">📦 Pressing coffre x{reservation.options.pressing_coffre_plafonnier.quantity}</div>
                                    )}
                                    {reservation.options.assaisonnement_ozone?.selected && (
                                      <div className="text-xs text-blue-600">🌬️ Ozone</div>
                                    )}
                                    {reservation.options.renov_chrome?.selected && (
                                      <div className="text-xs text-orange-600">✨ Renov chrome</div>
                                    )}
                                    {reservation.options.polissage?.selected && (
                                      <div className="text-xs text-orange-600">💎 Polissage</div>
                                    )}
                                    {reservation.options.lustrage?.selected && (
                                      <div className="text-xs text-orange-600">🔆 Lustrage</div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex justify-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(reservation.status)}`}>
                                  {reservation.status === 'confirmed' ? '✓ Confirmé' : 
                                   reservation.status === 'pending' ? '⏳ En attente' : '✗ Annulé'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <i className="bx bx-plus text-2xl text-gray-400 opacity-50 hover:opacity-100 hover:text-[#FFA600] transition-all"></i>
                              <div className="text-xs text-gray-400 mt-1 hover:text-[#FFA600] transition-colors">Cliquer pour RDV</div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Version Mobile/Tablette - Vue par jour */}
            <div className="lg:hidden space-y-4">
              {/* Navigation mobile */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <motion.button
                    onClick={() => {
                      const newDate = new Date(selectedMobileDate);
                      newDate.setDate(newDate.getDate() - 1);
                      setSelectedMobileDate(newDate);
                    }}
                    className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bx bx-chevron-left text-xl"></i>
                  </motion.button>
                  
                  <div className="text-center">
                    <h3 className={`text-lg font-bold ${isToday(selectedMobileDate) ? 'text-[#FFA600]' : 'text-gray-800'}`}>
                      {weekDays[selectedMobileDate.getDay() === 0 ? 6 : selectedMobileDate.getDay() - 1]} {selectedMobileDate.getDate()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {months[selectedMobileDate.getMonth()]} {selectedMobileDate.getFullYear()}
                    </p>
                    <p className="text-xs text-[#FFA600] mt-1">
                      {realReservations.filter(r => r.date === formatDate(selectedMobileDate)).length} réservation(s)
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      const newDate = new Date(selectedMobileDate);
                      newDate.setDate(newDate.getDate() + 1);
                      setSelectedMobileDate(newDate);
                    }}
                    className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bx bx-chevron-right text-xl"></i>
                  </motion.button>
                </div>

                {/* Bouton pour revenir à aujourd'hui */}
                {!isToday(selectedMobileDate) && (
                  <motion.button
                    onClick={() => setSelectedMobileDate(new Date())}
                    className="w-full py-2 bg-[#FFA600] text-white rounded-xl hover:bg-[#FF9500] transition-colors text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="bx bx-calendar-check mr-2"></i>
                    Revenir à aujourd'hui
                  </motion.button>
                )}
              </div>

              {/* Sélecteur de semaine pour mobile */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Changer de jour</h4>
                <div className="grid grid-cols-7 gap-1">
                  {weekDates.map((date, index) => {
                    const isSelectedMobileDate = formatDate(date) === formatDate(selectedMobileDate);
                    const dayReservations = realReservations.filter(r => r.date === formatDate(date)).length;
                    
                    return (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedMobileDate(date)}
                        className={`p-2 rounded-lg text-center transition-all text-xs ${
                          isSelectedMobileDate
                            ? 'bg-[#FFA600] text-white'
                            : isToday(date)
                              ? 'bg-orange-100 text-[#FFA600] border border-[#FFA600]'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="font-medium">
                          {weekDaysShort[index]}
                        </div>
                        <div className={`text-sm font-bold ${isSelectedMobileDate ? 'text-white' : isToday(date) ? 'text-[#FFA600]' : 'text-gray-800'}`}>
                          {date.getDate()}
                        </div>
                        {dayReservations > 0 && (
                          <div className={`text-xs ${isSelectedMobileDate ? 'text-orange-200' : 'text-[#FFA600]'}`}>
                            •
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Planning du jour sélectionné */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className={`p-4 text-center ${
                  isToday(selectedMobileDate) 
                    ? 'bg-gradient-to-br from-[#FFA600] to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-gray-50 to-gray-100'
                }`}>
                  <h3 className={`text-lg font-bold ${isToday(selectedMobileDate) ? 'text-white' : 'text-gray-800'}`}>
                    Planning du {selectedMobileDate.getDate()} {months[selectedMobileDate.getMonth()]}
                  </h3>
                  <p className={`text-sm ${isToday(selectedMobileDate) ? 'text-orange-100' : 'text-gray-600'}`}>
                    {realReservations.filter(r => r.date === formatDate(selectedMobileDate)).length} réservation(s)
                  </p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {timeSlots.map(timeSlot => {
                    const reservation = getReservationForTimeSlot(selectedMobileDate, timeSlot);
                    
                    return (
                      <motion.div
                        key={timeSlot}
                        className={`p-4 border-b border-gray-200 transition-all ${
                          reservation
                            ? `${getStatusColor(reservation.status)} border-l-4 border-l-[#FFA600]`
                            : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-mono font-bold text-gray-700 w-12">
                              {timeSlot}
                            </div>
                            {reservation ? (
                              <div className="flex-1">
                                <div className="font-bold text-gray-800 text-sm">{reservation.client}</div>
                                <div className="text-xs text-gray-600 truncate">{reservation.service}</div>
                                <div className="text-xs text-gray-500 truncate">{reservation.vehicle}</div>
                                
                                {/* Affichage compact des options pour mobile */}
                                {reservation.options && Object.keys(reservation.options).some(key => {
                                  const option = reservation.options[key];
                                  return (option.quantity > 0) || (option.selected === true);
                                }) && (
                                  <div className="mt-1">
                                    <div className="text-xs text-blue-600 font-medium">
                                      📦 Options: {[
                                        reservation.options.baume_sieges?.quantity > 0 && `💺x${reservation.options.baume_sieges.quantity}`,
                                        reservation.options.pressing_sieges?.quantity > 0 && `🪑x${reservation.options.pressing_sieges.quantity}`,
                                        reservation.options.pressing_tapis?.quantity > 0 && `🎯x${reservation.options.pressing_tapis.quantity}`,
                                        reservation.options.pressing_panneau_porte?.quantity > 0 && `🚪x${reservation.options.pressing_panneau_porte.quantity}`,
                                        reservation.options.renov_phare?.quantity > 0 && `💡x${reservation.options.renov_phare.quantity}`,
                                        reservation.options.pressing_coffre_plafonnier?.quantity > 0 && `📦x${reservation.options.pressing_coffre_plafonnier.quantity}`,
                                        reservation.options.assaisonnement_ozone?.selected && '🌬️',
                                        reservation.options.renov_chrome?.selected && '✨',
                                        reservation.options.polissage?.selected && '💎',
                                        reservation.options.lustrage?.selected && '🔆'
                                      ].filter(Boolean).join(', ')}
                                    </div>
                                  </div>
                                )}
                                
                                {reservation.phone && (
                                  <div className="text-xs text-[#FFA600] mt-1">
                                    <i className="bx bx-phone mr-1"></i>
                                    {reservation.phone}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div 
                                className="text-gray-400 text-sm hover:text-[#FFA600] transition-colors cursor-pointer"
                                onClick={() => openNewReservationModal(formatDate(selectedMobileDate), timeSlot)}
                              >
                                <i className="bx bx-plus mr-2"></i>
                                Créer un RDV
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end space-y-1">
                            {reservation && (
                              <>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(reservation.status)}`}>
                                  {reservation.status === 'confirmed' ? '✓' : 
                                   reservation.status === 'pending' ? '⏳' : 
                                   reservation.status === 'cancelled' ? '✗' : '✅'}
                                </span>
                                {reservation.prix && (
                                  <span className="text-xs font-bold text-[#FFA600]">
                                    {reservation.prix}€
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {reservation && reservation.commentaires && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                            <div className="text-xs text-blue-800">
                              <i className="bx bx-comment mr-1"></i>
                              {reservation.commentaires}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Statistiques mobile */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h4 className="text-sm font-bold text-gray-800 mb-3">Statistiques de la semaine</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">{realReservations.length}</div>
                    <div className="text-xs text-blue-700">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-xl font-bold text-green-600">
                      {realReservations.filter(r => r.status === 'confirmed').length}
                    </div>
                    <div className="text-xs text-green-700">Confirmées</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-xl">
                    <div className="text-xl font-bold text-orange-600">
                      {realReservations.filter(r => r.status === 'pending').length}
                    </div>
                    <div className="text-xs text-orange-700">En attente</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-xl font-bold text-purple-600">
                      {realReservations.reduce((total, r) => total + (parseFloat(r.prix) || 0), 0).toFixed(0)}€
                    </div>
                    <div className="text-xs text-purple-700">CA</div>
                  </div>
                </div>
                
                {/* Actions rapides mobile */}
                <div className="mt-4 space-y-3">
                  {/* Bouton principal - Nouveau RDV */}
                  <motion.button 
                    onClick={() => openNewReservationModal()}
                    className="w-full p-3 bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white rounded-xl hover:from-[#CC0000] hover:to-[#FF6600] transition-all duration-200 flex items-center gap-3 justify-center shadow-lg font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-1 bg-white/20 rounded-lg">
                      <i className="bx bx-plus text-lg"></i>
                    </div>
                    <span>Nouveau Rendez-vous</span>
                  </motion.button>
                  
                  {/* Actions secondaires */}
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button 
                      onClick={() => fetchWeekReservations(currentDate)}
                      disabled={loadingReservations}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center disabled:opacity-50 text-sm"
                      whileHover={{ scale: loadingReservations ? 1 : 1.02 }}
                      whileTap={{ scale: loadingReservations ? 1 : 0.98 }}
                    >
                      <i className={`bx ${loadingReservations ? 'bx-loader-alt animate-spin' : 'bx-refresh'}`}></i>
                      {loadingReservations ? 'MAJ...' : 'Actualiser'}
                    </motion.button>
                    
                    <motion.button 
                      onClick={exportContactsToPDF}
                      disabled={realReservations.length === 0}
                      className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: realReservations.length > 0 ? 1.02 : 1 }}
                      whileTap={{ scale: realReservations.length > 0 ? 0.98 : 1 }}
                    >
                      <i className="bx bx-download"></i>
                      PDF
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Panneau latéral - Masqué sur mobile, visible sur desktop */}
          <motion.div variants={itemVariants} className="hidden xl:block space-y-6">
            {/* Statistiques de la semaine - Version améliorée */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative overflow-hidden">
              {/* Fond décoratif */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFA600]/10 to-orange-500/5 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/5 rounded-full transform -translate-x-12 translate-y-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-[#FFA600] to-orange-500 rounded-xl">
                    <i className="bx bx-chart-bar text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Statistiques de la semaine</h3>
                    <p className="text-sm text-gray-500">Aperçu des performances</p>
                  </div>
                </div>

                {loadingReservations ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-12 h-12 border-4 border-[#FFA600] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <span className="text-gray-500 text-lg">Chargement des données...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-red-50 rounded-2xl mb-4">
                      <i className="bx bx-error text-5xl text-red-500 mb-3"></i>
                      <p className="text-red-600 font-medium mb-3">{error}</p>
                      <button 
                        onClick={() => fetchWeekReservations(currentDate)}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                      >
                        <i className="bx bx-refresh mr-2"></i>
                        Réessayer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Total réservations */}
                    <motion.div 
                      className="bg-gradient-to-br from-[#FFA600]/10 to-orange-500/5 rounded-2xl p-4 border border-[#FFA600]/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total réservations</p>
                          <p className="text-3xl font-bold text-[#FFA600] mt-1">{realReservations.length}</p>
                        </div>
                        <div className="p-3 bg-[#FFA600]/20 rounded-xl">
                          <i className="bx bx-calendar text-[#FFA600] text-2xl"></i>
                        </div>
                      </div>
                    </motion.div>

                    {/* Confirmées */}
                    <motion.div 
                      className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl p-4 border border-green-500/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Confirmées</p>
                          <p className="text-3xl font-bold text-green-600 mt-1">
                            {realReservations.filter(r => r.status === 'confirmed').length}
                          </p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl">
                          <i className="bx bx-check-circle text-green-600 text-2xl"></i>
                        </div>
                      </div>
                    </motion.div>

                    {/* En attente */}
                    <motion.div 
                      className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-2xl p-4 border border-orange-500/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">En attente</p>
                          <p className="text-3xl font-bold text-orange-600 mt-1">
                            {realReservations.filter(r => r.status === 'pending').length}
                          </p>
                        </div>
                        <div className="p-3 bg-orange-500/20 rounded-xl">
                          <i className="bx bx-time-five text-orange-600 text-2xl"></i>
                        </div>
                      </div>
                    </motion.div>

                    {/* Créneaux libres */}
                    <motion.div 
                      className="bg-gradient-to-br from-blue-500/10 to-sky-500/5 rounded-2xl p-4 border border-blue-500/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Créneaux libres</p>
                          <p className="text-3xl font-bold text-blue-600 mt-1">
                            {(generateTimeSlots().length * 7) - realReservations.length}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                          <i className="bx bx-calendar-plus text-blue-600 text-2xl"></i>
                        </div>
                      </div>
                    </motion.div>

                    {/* Chiffre d'affaires */}
                    <motion.div 
                      className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 rounded-2xl p-4 border border-purple-500/20 sm:col-span-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Chiffre d'affaires</p>
                          <p className="text-3xl font-bold text-purple-600 mt-1">
                            {realReservations.reduce((total, r) => total + (parseFloat(r.prix) || 0), 0).toFixed(2)}€
                          </p>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                          <i className="bx bx-euro text-purple-600 text-2xl"></i>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides - Version améliorée */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative overflow-hidden">
              {/* Fond décoratif */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-500/10 to-slate-500/5 rounded-full transform translate-x-12 -translate-y-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl">
                    <i className="bx bx-wrench text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Actions</h3>
                    <p className="text-sm text-gray-500">Gestion du planning</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <motion.button 
                    onClick={() => fetchWeekReservations(currentDate)}
                    disabled={loadingReservations}
                    className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
                    whileHover={{ scale: loadingReservations ? 1 : 1.02 }}
                    whileTap={{ scale: loadingReservations ? 1 : 0.98 }}
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <i className={`bx ${loadingReservations ? 'bx-loader-alt animate-spin' : 'bx-refresh'} text-xl`}></i>
                    </div>
                    <span className="text-lg">
                      {loadingReservations ? 'Actualisation...' : 'Actualiser'}
                    </span>
                  </motion.button>

                  <motion.button 
                    onClick={() => openNewReservationModal()}
                    className="w-full p-4 bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white rounded-xl hover:from-[#CC0000] hover:to-[#FF6600] transition-all duration-200 flex items-center gap-3 justify-center shadow-lg hover:shadow-xl font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <i className="bx bx-plus text-xl"></i>
                    </div>
                    <span className="text-lg">Nouveau RDV</span>
                  </motion.button>

                  <motion.button 
                    onClick={exportContactsToPDF}
                    disabled={realReservations.length === 0}
                    className="w-full p-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 flex items-center gap-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
                    whileHover={{ scale: realReservations.length > 0 ? 1.02 : 1 }}
                    whileTap={{ scale: realReservations.length > 0 ? 0.98 : 1 }}
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <i className="bx bx-contacts text-xl"></i>
                    </div>
                    <span className="text-lg">PDF Contacts</span>
                  </motion.button>
                </div>

                {/* Statut de mise à jour amélioré */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : loadingReservations ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                      <span className="text-sm font-medium">
                        MAJ: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </span>
                    </div>
                    {error && (
                      <div className="flex items-center gap-1 text-red-500">
                        <i className="bx bx-error-circle text-sm"></i>
                        <span className="text-xs">Erreur</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section des réservations détaillées */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Liste des Réservations</h2>
                  <p className="text-gray-600">Toutes les réservations de la semaine avec informations clients</p>
                </div>
                
                {/* Bouton de suppression par mois */}
                <div className="flex gap-2">
                  <motion.button 
                    onClick={openDeleteMonthModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="bx bx-trash text-lg"></i>
                    <span className="hidden sm:inline">Effacer par mois</span>
                    <span className="sm:hidden">Effacer</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {loadingReservations ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-[#FFA600] border-t-transparent rounded-full mx-auto mb-4"></div>
                <span className="text-gray-500 text-lg">Chargement des réservations...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <i className="bx bx-error text-6xl text-red-500 mb-4"></i>
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button 
                  onClick={() => fetchWeekReservations(currentDate)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : realReservations.length === 0 ? (
              <div className="text-center py-12">
                <i className="bx bx-calendar-x text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg">Aucune réservation cette semaine</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Version tableau pour écrans larges */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-left">
                          <th className="px-6 py-4 text-sm font-bold text-gray-700 rounded-l-lg">Date & Heure</th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-700">Client</th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-700">Contact</th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-700">Véhicule</th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-700">Service</th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-700">Prix</th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-700">Statut</th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-700 rounded-r-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {realReservations
                          .sort((a, b) => {
                            const dateTimeA = new Date(`${a.date}T${a.time}:00`);
                            const dateTimeB = new Date(`${b.date}T${b.time}:00`);
                            return dateTimeA - dateTimeB;
                          })
                          .map((reservation, index) => (
                          <motion.tr 
                            key={reservation.id}
                            className="hover:bg-gray-50 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">
                                  {new Date(reservation.date).toLocaleDateString('fr-FR', { 
                                    weekday: 'short', 
                                    day: '2-digit', 
                                    month: '2-digit' 
                                  })}
                                </span>
                                <span className="text-sm text-[#FFA600] font-mono font-bold">
                                  {reservation.time}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{reservation.client}</span>
                                {reservation.adresse && (
                                  <span className="text-sm text-gray-500 truncate max-w-[150px]" title={reservation.adresse}>
                                    <i className="bx bx-map-pin mr-1"></i>
                                    {reservation.adresse}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <i className="bx bx-phone mr-2 text-[#FFA600]"></i>
                                  <a href={`tel:${reservation.phone}`} className="hover:text-[#FFA600] transition-colors">
                                    {reservation.phone}
                                  </a>
                                </div>
                                {reservation.email && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <i className="bx bx-envelope mr-2 text-[#FFA600]"></i>
                                    <a href={`mailto:${reservation.email}`} className="hover:text-[#FFA600] transition-colors truncate max-w-[150px]">
                                      {reservation.email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <i className="bx bx-car text-[#FFA600] mr-2"></i>
                                <span className="text-sm text-gray-900">{reservation.vehicle}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{reservation.service}</span>
                                
                                {/* Affichage des options supplémentaires */}
                                {renderOptions(reservation.options, reservation.vehicleType)?.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    <div className="text-xs font-medium text-blue-600 flex items-center">
                                      <i className="bx bx-wrench mr-1"></i>
                                      Options:
                                    </div>
                                    {renderOptions(reservation.options, reservation.vehicleType).map((option, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-xs bg-blue-50 rounded px-2 py-1 max-w-[250px]">
                                        <div className="flex items-center">
                                          <i className="bx bx-check-circle text-blue-600 mr-1"></i>
                                          <span className="text-gray-700">{option.name}</span>
                                          {option.hasReduction && (
                                            <span className="ml-1 bg-green-100 text-green-700 px-1 rounded text-[10px]">
                                              -x4
                                            </span>
                                          )}
                                        </div>
                                        <span className={`font-medium ${option.price === 'Sur devis' ? 'text-orange-600' : 'text-blue-600'}`}>
                                          {option.price === 'Sur devis' ? option.price : `${parseFloat(option.price.replace('€', '')).toFixed(0)}€`}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {reservation.commentaires && (
                                  <div className="mt-1 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 max-w-[200px]">
                                    <i className="bx bx-comment mr-1"></i>
                                    <span className="truncate" title={reservation.commentaires}>
                                      {reservation.commentaires}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-[#FFA600] text-lg">
                                {reservation.prix ? `${reservation.prix}€` : 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                                {reservation.status === 'confirmed' ? (
                                  <>
                                    <i className="bx bx-check mr-1"></i>
                                    Confirmé
                                  </>
                                ) : reservation.status === 'pending' ? (
                                  <>
                                    <i className="bx bx-time mr-1"></i>
                                    En attente
                                  </>
                                ) : reservation.status === 'cancelled' ? (
                                  <>
                                    <i className="bx bx-x mr-1"></i>
                                    Annulé
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-check-circle mr-1"></i>
                                    Terminé
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="relative group">
                                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-[#FFA600] hover:text-white transition-colors">
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                  </button>
                                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                    <div className="py-2">
                                      {reservation.status !== 'confirmed' && (
                                        <button 
                                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                          className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center"
                                        >
                                          <i className="bx bx-check mr-2"></i>
                                          Confirmer
                                        </button>
                                      )}
                                      {reservation.status !== 'pending' && (
                                        <button 
                                          onClick={() => updateReservationStatus(reservation.id, 'pending')}
                                          className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center"
                                        >
                                          <i className="bx bx-time mr-2"></i>
                                          Mettre en attente
                                        </button>
                                      )}
                                      {reservation.status !== 'completed' && (
                                        <button 
                                          onClick={() => updateReservationStatus(reservation.id, 'completed')}
                                          className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center"
                                        >
                                          <i className="bx bx-check-circle mr-2"></i>
                                          Marquer terminé
                                        </button>
                                      )}
                                      {reservation.status !== 'cancelled' && (
                                        <button 
                                          onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                          className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center"
                                        >
                                          <i className="bx bx-x mr-2"></i>
                                          Annuler
                                        </button>
                                      )}
                                      <hr className="my-2" />
                                      <button 
                                        onClick={() => deleteReservation(reservation.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                                      >
                                        <i className="bx bx-trash mr-2"></i>
                                        Supprimer
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Version cartes pour écrans mobiles */}
                <div className="lg:hidden space-y-4">
                  {realReservations
                    .sort((a, b) => {
                      const dateTimeA = new Date(`${a.date}T${a.time}:00`);
                      const dateTimeB = new Date(`${b.date}T${b.time}:00`);
                      return dateTimeA - dateTimeB;
                    })
                    .map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{reservation.client}</h3>
                          <div className="flex items-center text-[#FFA600] font-mono font-bold">
                            <i className="bx bx-time mr-2"></i>
                            {new Date(reservation.date).toLocaleDateString('fr-FR', { 
                              weekday: 'long', 
                              day: '2-digit', 
                              month: '2-digit' 
                            })} à {reservation.time}
                          </div>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status === 'confirmed' ? 'Confirmé' : 
                           reservation.status === 'pending' ? 'En attente' : 
                           reservation.status === 'cancelled' ? 'Annulé' : 'Terminé'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="bx bx-phone mr-2 text-[#FFA600]"></i>
                            <a href={`tel:${reservation.phone}`} className="hover:text-[#FFA600] transition-colors">
                              {reservation.phone}
                            </a>
                          </div>
                          {reservation.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <i className="bx bx-envelope mr-2 text-[#FFA600]"></i>
                              <a href={`mailto:${reservation.email}`} className="hover:text-[#FFA600] transition-colors">
                                {reservation.email}
                              </a>
                            </div>
                          )}
                          {reservation.adresse && (
                            <div className="flex items-start text-sm text-gray-600">
                              <i className="bx bx-map-pin mr-2 text-[#FFA600] mt-0.5"></i>
                              <span>{reservation.adresse}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="bx bx-car mr-2 text-[#FFA600]"></i>
                            <span>{reservation.vehicle}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="bx bx-package mr-2 text-[#FFA600]"></i>
                            <span>{reservation.service}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="bx bx-euro mr-2 text-[#FFA600]"></i>
                            <span className="font-bold text-[#FFA600]">
                              {reservation.prix ? `${reservation.prix}€` : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Affichage des options supplémentaires pour mobile */}
                      {renderOptions(reservation.options, reservation.vehicleType)?.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="mb-2">
                            <div className="text-sm font-medium text-blue-800 flex items-center">
                              <i className="bx bx-wrench mr-2 text-blue-600"></i>
                              Options supplémentaires
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {renderOptions(reservation.options, reservation.vehicleType).map((option, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100">
                                <div className="flex items-center">
                                  <i className="bx bx-check-circle text-green-600 mr-2"></i>
                                  <span className="text-sm text-gray-700">{option.name}</span>
                                  {option.hasReduction && (
                                    <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                      Réduction x4 !
                                    </span>
                                  )}
                                </div>
                                <span className={`font-medium text-sm ${option.price === 'Sur devis' ? 'text-orange-600' : 'text-blue-600'}`}>
                                  {option.price === 'Sur devis' ? option.price : `${parseFloat(option.price.replace('€', '')).toFixed(0)}€`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {reservation.commentaires && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start text-sm text-gray-800">
                            <i className="bx bx-comment mr-2 text-gray-600 mt-0.5"></i>
                            <span>{reservation.commentaires}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {reservation.status !== 'confirmed' && (
                          <button 
                            onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
                          >
                            <i className="bx bx-check mr-1"></i>
                            Confirmer
                          </button>
                        )}
                        {reservation.status !== 'pending' && (
                          <button 
                            onClick={() => updateReservationStatus(reservation.id, 'pending')}
                            className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors flex items-center"
                          >
                            <i className="bx bx-time mr-1"></i>
                            En attente
                          </button>
                        )}
                        {reservation.status !== 'completed' && (
                          <button 
                            onClick={() => updateReservationStatus(reservation.id, 'completed')}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center"
                          >
                            <i className="bx bx-check-circle mr-1"></i>
                            Terminé
                          </button>
                        )}
                        {reservation.status !== 'cancelled' && (
                          <button 
                            onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center"
                          >
                            <i className="bx bx-x mr-1"></i>
                            Annuler
                          </button>
                        )}
                        <button 
                          onClick={() => deleteReservation(reservation.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center"
                        >
                          <i className="bx bx-trash mr-1"></i>
                          Supprimer
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Résumé en bas */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{realReservations.length}</div>
                      <div className="text-sm text-blue-700">Total réservations</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {realReservations.filter(r => r.status === 'confirmed').length}
                      </div>
                      <div className="text-sm text-green-700">Confirmées</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600">
                        {realReservations.filter(r => r.status === 'pending').length}
                      </div>
                      <div className="text-sm text-orange-700">En attente</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">
                        {realReservations.reduce((total, r) => total + (parseFloat(r.prix) || 0), 0).toFixed(2)}€
                      </div>
                      <div className="text-sm text-purple-700">Chiffre d'affaires</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modal de suppression par mois */}
        {showDeleteMonthModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteMonthModal(false)}
          >
            <motion.div 
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <i className="bx bx-trash text-red-600 text-2xl"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Supprimer les réservations</h2>
                    <p className="text-gray-600 text-sm">Cette action est irréversible</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                    <div className="flex items-center gap-2 text-red-800 mb-2">
                      <i className="bx bx-error-circle"></i>
                      <span className="font-bold">Attention !</span>
                    </div>
                    <p className="text-red-700 text-sm">
                      Vous êtes sur le point de supprimer <strong>TOUTES</strong> les réservations du mois sélectionné. 
                      Cette action ne peut pas être annulée.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Année
                      </label>
                      <select
                        value={deleteMonthData.year}
                        onChange={(e) => setDeleteMonthData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        disabled={deletingMonth}
                      >
                        {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mois
                      </label>
                      <select
                        value={deleteMonthData.month}
                        onChange={(e) => setDeleteMonthData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        disabled={deletingMonth}
                      >
                        {months.map((month, index) => (
                          <option key={index + 1} value={index + 1}>{month}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Période sélectionnée :</strong> {months[deleteMonthData.month - 1]} {deleteMonthData.year}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteMonthModal(false)}
                    disabled={deletingMonth}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  
                  <button
                    type="button"
                    onClick={deleteReservationsByMonth}
                    disabled={deletingMonth}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2 justify-center"
                  >
                    {deletingMonth ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Suppression...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-trash"></i>
                        Supprimer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de nouvelle réservation */}
        {showNewReservationModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewReservationModal(false)}
          >
            <motion.div 
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-[#FFA600] to-orange-500 rounded-xl">
                      <i className="bx bx-calendar-plus text-white text-2xl"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Nouveau Rendez-vous</h2>
                      <p className="text-gray-600">Créer une nouvelle réservation pour un client</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowNewReservationModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <i className="bx bx-x text-2xl text-gray-600"></i>
                  </button>
                </div>
              </div>

              <form onSubmit={createNewReservation} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations client */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <i className="bx bx-user text-[#FFA600]"></i>
                      Informations Client
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          value={newReservationData.prenom}
                          onChange={handleNewReservationChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                          placeholder="Prénom du client"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={newReservationData.nom}
                          onChange={handleNewReservationChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                          placeholder="Nom du client"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        value={newReservationData.telephone}
                        onChange={handleNewReservationChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                        placeholder="06 12 34 56 78"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newReservationData.email}
                        onChange={handleNewReservationChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                        placeholder="client@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse *
                      </label>
                      <textarea
                        name="adresse"
                        value={newReservationData.adresse}
                        onChange={handleNewReservationChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors resize-none"
                        placeholder="Adresse complète du client"
                        required
                      />
                    </div>
                  </div>

                  {/* Informations véhicule et service */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <i className="bx bx-car text-[#FFA600]"></i>
                      Véhicule & Service
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type de véhicule *
                        </label>
                        <select
                          name="type_voiture"
                          value={newReservationData.type_voiture}
                          onChange={handleNewReservationChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                          required
                        >
                          <option value="">Sélectionner...</option>
                          <option value="petite-citadine">Petite Citadine</option>
                          <option value="citadine">Citadine</option>
                          <option value="berline">Berline</option>
                          <option value="suv">SUV</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marque *
                        </label>
                        <input
                          type="text"
                          name="marque_voiture"
                          value={newReservationData.marque_voiture}
                          onChange={handleNewReservationChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                          placeholder="Renault, Peugeot..."
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formule de service *
                      </label>
                      <select
                        name="formule"
                        value={newReservationData.formule}
                        onChange={handleNewReservationChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Sélectionner une formule...</option>
                        <option value="Beauté extérieur">Beauté extérieur</option>
                        <option value="Beauté intérieure">Beauté intérieure</option>
                        <option value="Beauté intégrale">Beauté intégrale (premium en option)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (€)
                      </label>
                      <input
                        type="number"
                        name="prix"
                        value={newReservationData.prix}
                        onChange={handleNewReservationChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                        placeholder="25.00"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date_rdv"
                          value={newReservationData.date_rdv}
                          onChange={handleNewReservationChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure *
                        </label>
                        <select
                          name="heure_rdv"
                          value={newReservationData.heure_rdv}
                          onChange={handleNewReservationChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors"
                          required
                        >
                          <option value="">Sélectionner...</option>
                          {generateTimeSlots().map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commentaires
                      </label>
                      <textarea
                        name="commentaires"
                        value={newReservationData.commentaires}
                        onChange={handleNewReservationChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FFA600] focus:outline-none transition-colors resize-none"
                        placeholder="Instructions spéciales, demandes particulières..."
                      />
                    </div>
                  </div>

                  {/* Section Options Supplémentaires */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <i className="bx bx-plus-circle text-[#FF0000]"></i>
                      Options Supplémentaires
                    </h3>

                    {/* Options avec quantité et réduction x4 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                     <i className="bx bx-car-mechanic text-[#FF0000]"></i>
                          Services avec quantité
                        </h4>

                        {/* Baume sièges */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="font-medium text-gray-700">Baume sièges</label>
                            <div className="text-sm text-gray-600">
                              x1: 20€ | x4: 60€
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleOptionQuantityChange('baume_sieges', newReservationData.options.baume_sieges.quantity - 1)}
                              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <i className="bx bx-minus"></i>
                            </button>
                                                         <input
                               type="number"
                               value={newReservationData.options.baume_sieges.quantity}
                               onChange={(e) => handleOptionQuantityChange('baume_sieges', e.target.value)}
                               min="0"
                               className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:border-[#FF0000] focus:outline-none"
                             />
                            <button
                              type="button"
                              onClick={() => handleOptionQuantityChange('baume_sieges', newReservationData.options.baume_sieges.quantity + 1)}
                              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <i className="bx bx-plus"></i>
                            </button>
                                                         <div className="ml-auto font-bold text-[#FF0000]">
                               {calculateOptionPrice(newReservationData.options.baume_sieges)}€
                             </div>
                          </div>
                        </div>

                        {/* Pressing des sièges */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="font-medium text-gray-700">Pressing des sièges</label>
                            <div className="text-sm text-gray-600">
                              x1: 30€ | x4: 75€
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleOptionQuantityChange('pressing_sieges', newReservationData.options.pressing_sieges.quantity - 1)}
                              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <i className="bx bx-minus"></i>
                            </button>
                                                         <input
                               type="number"
                               value={newReservationData.options.pressing_sieges.quantity}
                               onChange={(e) => handleOptionQuantityChange('pressing_sieges', e.target.value)}
                               min="0"
                               className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:border-[#FF0000] focus:outline-none"
                             />
                            <button
                              type="button"
                              onClick={() => handleOptionQuantityChange('pressing_sieges', newReservationData.options.pressing_sieges.quantity + 1)}
                              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <i className="bx bx-plus"></i>
                            </button>
                                                         <div className="ml-auto font-bold text-[#FF0000]">
                               {calculateOptionPrice(newReservationData.options.pressing_sieges)}€
                             </div>
                          </div>
                        </div>

                        {/* Pressing des tapis */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="font-medium text-gray-700">Pressing des tapis</label>
                            <div className="text-sm text-gray-600">
                              x1: 30€ | x4: 75€
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleOptionQuantityChange('pressing_tapis', newReservationData.options.pressing_tapis.quantity - 1)}
                              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <i className="bx bx-minus"></i>
                            </button>
                                                         <input
                               type="number"
                               value={newReservationData.options.pressing_tapis.quantity}
                               onChange={(e) => handleOptionQuantityChange('pressing_tapis', e.target.value)}
                               min="0"
                               className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:border-[#FF0000] focus:outline-none"
                             />
                            <button
                              type="button"
                              onClick={() => handleOptionQuantityChange('pressing_tapis', newReservationData.options.pressing_tapis.quantity + 1)}
                              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <i className="bx bx-plus"></i>
                            </button>
                                                         <div className="ml-auto font-bold text-[#FF0000]">
                               {calculateOptionPrice(newReservationData.options.pressing_tapis)}€
                             </div>
                           </div>
                         </div>
 
                         {/* Pressing panneau de porte */}
                         <div className="bg-gray-50 rounded-xl p-4">
                           <div className="flex items-center justify-between mb-3">
                             <label className="font-medium text-gray-700">Pressing panneau de porte</label>
                             <div className="text-sm text-gray-600">
                               x1: 30€ | x4: 75€
                             </div>
                           </div>
                           <div className="flex items-center gap-3">
                             <button
                               type="button"
                               onClick={() => handleOptionQuantityChange('pressing_panneau_porte', newReservationData.options.pressing_panneau_porte.quantity - 1)}
                               className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                             >
                               <i className="bx bx-minus"></i>
                             </button>
                             <input
                               type="number"
                               value={newReservationData.options.pressing_panneau_porte.quantity}
                               onChange={(e) => handleOptionQuantityChange('pressing_panneau_porte', e.target.value)}
                               min="0"
                               className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:border-[#FF0000] focus:outline-none"
                             />
                             <button
                               type="button"
                               onClick={() => handleOptionQuantityChange('pressing_panneau_porte', newReservationData.options.pressing_panneau_porte.quantity + 1)}
                               className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                             >
                               <i className="bx bx-plus"></i>
                             </button>
                             <div className="ml-auto font-bold text-[#FF0000]">
                               {calculateOptionPrice(newReservationData.options.pressing_panneau_porte)}€
                             </div>
                          </div>
                        </div>

                        {/* Renov phare */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="font-medium text-gray-700">Renov phare</label>
                            <div className="text-sm text-gray-600">
                              x1: 30€ | x4: 100€
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleOptionQuantityChange('renov_phare', newReservationData.options.renov_phare.quantity - 1)}
                              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <i className="bx bx-minus"></i>
                            </button>
                            <input
                              type="number"
                              value={newReservationData.options.renov_phare.quantity}
                              onChange={(e) => handleOptionQuantityChange('renov_phare', e.target.value)}
                              min="0"
                                                             className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:border-[#FF0000] focus:outline-none"
                             />
                             <button
                               type="button"
                               onClick={() => handleOptionQuantityChange('renov_phare', newReservationData.options.renov_phare.quantity + 1)}
                               className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                             >
                               <i className="bx bx-plus"></i>
                             </button>
                             <div className="ml-auto font-bold text-[#FF0000]">
                               {calculateOptionPrice(newReservationData.options.renov_phare)}€
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                     <i className="bx bx-wrench text-[#FF0000]"></i>
                          Services spéciaux
                        </h4>

                        {/* Pressing coffre ou plafonnier */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="font-medium text-gray-700">Pressing coffre/plafonnier</label>
                            <div className="text-sm text-gray-600">
                              30€/unité
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleOptionQuantityChange('pressing_coffre_plafonnier', newReservationData.options.pressing_coffre_plafonnier.quantity - 1)}
                              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <i className="bx bx-minus"></i>
                            </button>
                            <input
                              type="number"
                              value={newReservationData.options.pressing_coffre_plafonnier.quantity}
                              onChange={(e) => handleOptionQuantityChange('pressing_coffre_plafonnier', e.target.value)}
                              min="0"
                                                             className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:border-[#FF0000] focus:outline-none"
                             />
                             <button
                               type="button"
                               onClick={() => handleOptionQuantityChange('pressing_coffre_plafonnier', newReservationData.options.pressing_coffre_plafonnier.quantity + 1)}
                               className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                             >
                               <i className="bx bx-plus"></i>
                             </button>
                             <div className="ml-auto font-bold text-[#FF0000]">
                               {newReservationData.options.pressing_coffre_plafonnier.quantity * newReservationData.options.pressing_coffre_plafonnier.prix_unitaire}€
                             </div>
                          </div>
                        </div>

                        {/* Assaisonnement à l'ozone */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="font-medium text-gray-700">Assaisonnement à l'ozone</label>
                              <div className="text-sm text-gray-600">20-25min - 30€</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={newReservationData.options.assaisonnement_ozone.selected}
                                onChange={() => handleOptionToggle('assaisonnement_ozone')}
                                                                 className="w-5 h-5 text-[#FF0000] rounded focus:ring-[#FF0000]"
                               />
                               <div className="font-bold text-[#FF0000]">
                                 {newReservationData.options.assaisonnement_ozone.selected ? '30€' : '0€'}
                               </div>
                            </div>
                          </div>
                        </div>

                        {/* Lavage Premium */}
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <label className="font-medium text-gray-700 flex items-center gap-2">
                                💎 Beauté Premium
                                <span className="inline-block animate-pulse">✨</span>
                              </label>
                              <div className="text-sm text-gray-600">Service haut de gamme</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={newReservationData.options.lavage_premium.selected}
                                onChange={() => handleOptionToggle('lavage_premium')}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-600"
                              />
                              <div className="font-bold text-purple-600">
                                {newReservationData.options.lavage_premium.selected ? `${(() => {
                                  const selectedFormule = formules.find(f => f.nom === newReservationData.formule);
                                  const price = selectedFormule?.lavage_premium_prix || newReservationData.options.lavage_premium.prix_personnalise || 120;
                                  return parseFloat(price).toFixed(0);
                                })()}€` : '0€'}
                              </div>
                            </div>
                          </div>
                          {newReservationData.options.lavage_premium.selected && (
                            <div className="mt-3 pt-3 border-t border-purple-200">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prix personnalisé (€)
                              </label>
                              <input
                                type="number"
                                value={newReservationData.options.lavage_premium.prix_personnalise}
                                onChange={(e) => handleLavagePremiumPriceChange(e.target.value)}
                                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder={(() => {
                                  const selectedFormule = formules.find(f => f.nom === newReservationData.formule);
                                  return selectedFormule?.lavage_premium_prix || "120";
                                })()}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          )}
                        </div>

                        {/* Services sur devis */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-600">Services sur devis</h5>

                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <label className="font-medium text-gray-700">Renov chrome</label>
                              <input
                                type="checkbox"
                                checked={newReservationData.options.renov_chrome.selected}
                                onChange={() => handleOptionToggle('renov_chrome')}
                                                                 className="w-5 h-5 text-[#FF0000] rounded focus:ring-[#FF0000]"
                               />
                             </div>
                           </div>
 
                           <div className="bg-gray-50 rounded-xl p-4">
                             <div className="flex items-center justify-between">
                               <label className="font-medium text-gray-700">Polissage</label>
                               <input
                                 type="checkbox"
                                 checked={newReservationData.options.polissage.selected}
                                 onChange={() => handleOptionToggle('polissage')}
                                 className="w-5 h-5 text-[#FF0000] rounded focus:ring-[#FF0000]"
                               />
                             </div>
                           </div>
 
                           <div className="bg-gray-50 rounded-xl p-4">
                             <div className="flex items-center justify-between">
                               <label className="font-medium text-gray-700">Lustrage</label>
                               <input
                                 type="checkbox"
                                 checked={newReservationData.options.lustrage.selected}
                                 onChange={() => handleOptionToggle('lustrage')}
                                 className="w-5 h-5 text-[#FF0000] rounded focus:ring-[#FF0000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                                         {/* Récapitulatif des prix */}
                     <div className="bg-gradient-to-r from-[#FF0000]/10 to-[#FF4500]/5 rounded-xl p-6 border border-[#FF0000]/20">
                       <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                         <i className="bx bx-calculator text-[#FF0000]"></i>
                         Récapitulatif des prix
                       </h4>
                       <div className="space-y-2">
                         <div className="flex justify-between">
                           <span className="text-gray-600">Prix de base :</span>
                           <span className="font-medium">{parseFloat(newReservationData.prix || 0).toFixed(0)}€</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600">Options :</span>
                           <span className="font-medium">{parseFloat(calculateTotalOptionsPrice()).toFixed(0)}€</span>
                         </div>
                         <hr className="border-gray-300" />
                         <div className="flex justify-between text-lg font-bold">
                           <span className="text-gray-800">Total :</span>
                           <span className="text-[#FF0000]">
                             {parseFloat((parseFloat(newReservationData.prix) || 0) + calculateTotalOptionsPrice()).toFixed(0)}€
                           </span>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewReservationModal(false);
                      resetNewReservationForm();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 justify-center"
                  >
                    <i className="bx bx-x"></i>
                    Annuler
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetNewReservationForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 justify-center"
                  >
                    <i className="bx bx-refresh"></i>
                    Réinitialiser
                  </button>

                  <button
                    type="submit"
                    disabled={submittingReservation}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white rounded-xl hover:from-[#CC0000] hover:to-[#FF6600] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                  >
                    {submittingReservation ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-check"></i>
                        Créer le Rendez-vous
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Calendar; 