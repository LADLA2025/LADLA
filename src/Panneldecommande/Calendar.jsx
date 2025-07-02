import React, { useState, useEffect } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../../config/api.js';
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
    commentaires: ''
  });
  const [submittingReservation, setSubmittingReservation] = useState(false);

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
          // Extraire juste la partie date de la chaîne ISO et ajouter un jour pour corriger le décalage UTC
          const dateString = reservation.date_rdv.split('T')[0];
          const date = new Date(dateString + 'T12:00:00'); // Utilise midi pour éviter les problèmes de timezone
          date.setDate(date.getDate() + 1); // Ajouter un jour pour corriger le décalage
          const formattedDate = date.toISOString().split('T')[0];
          
          return {
            id: reservation.id,
            date: formattedDate,
            time: reservation.heure_rdv.substring(0, 5), // Format HH:MM
            client: `${reservation.prenom} ${reservation.nom}`,
            service: reservation.formule,
            vehicle: `${reservation.marque_voiture} ${reservation.type_voiture}`,
            phone: reservation.telephone,
            status: reservation.status,
            email: reservation.email,
            adresse: reservation.adresse,
            commentaires: reservation.commentaires,
            prix: reservation.prix
          };
        });
        
        setRealReservations(formattedReservations);
        setLastUpdate(new Date());
        
        // Debug : afficher les données formatées
        console.log('📅 Réservations formatées pour le calendrier:', formattedReservations);
        
        // Calculer les dates de la semaine pour le debug
        const weekDatesForDebug = getWeekDates(date);
        console.log('🗓️ Dates de la semaine:', weekDatesForDebug.map(d => d.toISOString().split('T')[0]));
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

  // Charger les réservations lors du changement de date
  useEffect(() => {
    fetchWeekReservations(currentDate);
  }, [currentDate]);

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
        prix: newReservationData.prix || 0,
        date: newReservationData.date_rdv,
        heure: newReservationData.heure_rdv,
        commentaires: newReservationData.commentaires || '',
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
        // Recharger les réservations
        await fetchWeekReservations(currentDate);
        // Réinitialiser le formulaire et fermer le modal
        resetNewReservationForm();
        setShowNewReservationModal(false);
        alert('Réservation créée avec succès !');
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
      commentaires: ''
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
    const currentDay = date.getDay() || 7; // 0 = dimanche, on veut 7
    const monday = new Date(date);
    monday.setDate(date.getDate() - currentDay + 1);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(monday);
      dateObj.setDate(monday.getDate() + i);
      dates.push(dateObj);
    }
    return dates;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getReservationForTimeSlot = (date, timeSlot) => {
    const dateStr = formatDate(date);
    const reservation = realReservations.find(res => res.date === dateStr && res.time === timeSlot);
    
    // Debug : afficher les tentatives de matching
    if (realReservations.length > 0 && !reservation) {
      console.log(`🔍 Recherche réservation pour ${dateStr} à ${timeSlot}`);
      console.log('📋 Réservations disponibles:', realReservations.map(r => `${r.date} à ${r.time} (${r.client})`));
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
                    className="w-full p-3 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white rounded-xl hover:from-[#FF9500] hover:to-orange-600 transition-all duration-200 flex items-center gap-3 justify-center shadow-lg font-medium"
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
                    className="w-full p-4 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white rounded-xl hover:from-[#FF9500] hover:to-orange-600 transition-all duration-200 flex items-center gap-3 justify-center shadow-lg hover:shadow-xl font-medium"
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Liste des Réservations</h2>
              <p className="text-gray-600">Toutes les réservations de la semaine avec informations clients</p>
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
                                {reservation.commentaires && (
                                  <div className="mt-1 text-xs text-gray-500 bg-blue-50 rounded px-2 py-1 max-w-[200px]">
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

                      {reservation.commentaires && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start text-sm text-blue-800">
                            <i className="bx bx-comment mr-2 text-blue-600 mt-0.5"></i>
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
                        <option value="Lavage Express">Lavage Express</option>
                        <option value="Lavage Standard">Lavage Standard</option>
                        <option value="Lavage Premium">Lavage Premium</option>
                        <option value="Lavage Complet">Lavage Complet</option>
                        <option value="Détailling Intérieur">Détailling Intérieur</option>
                        <option value="Détailling Extérieur">Détailling Extérieur</option>
                        <option value="Détailling Complet">Détailling Complet</option>
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white rounded-xl hover:from-[#FF9500] hover:to-orange-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
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