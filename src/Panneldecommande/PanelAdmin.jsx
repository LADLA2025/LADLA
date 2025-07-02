import React, { useState, useEffect } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../config/api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Services1 from './Services1';
import Calendar from './Calendar';
import Settings from './Settings';

const PanelAdmin = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    weekReservations: 0,
    monthServices: 0,
    monthRevenue: 0,
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    popularFormulas: [],
    popularVehicleTypes: [],
    formulaVehicleStats: []
  });
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fonction pour calculer les dates de la semaine (même logique que le calendrier)
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

  // Fonction pour extraire le type de véhicule de façon robuste
  const extractVehicleType = (reservation) => {
    // Essayer différents champs possibles
    const possibleFields = [
      reservation.type_voiture,
      reservation.typeVoiture, 
      reservation.typeVehicule,
      reservation.vehicleType
    ];
    
    for (let field of possibleFields) {
      if (field && field !== null && field !== undefined && field !== '') {
        return field;
      }
    }
    
    return 'non-specifie';
  };

  // Fonction pour récupérer toutes les réservations d'un mois spécifique
  const fetchAllMonthReservations = async (yearMonth = null) => {
    try {
      let targetDate;
      if (yearMonth) {
        const [year, month] = yearMonth.split('-');
        targetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      } else {
        targetDate = new Date();
      }
      
      const currentMonth = targetDate.getMonth();
      const currentYear = targetDate.getFullYear();
      
      // Obtenir le premier et dernier jour du mois
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      const allReservations = [];
      
      // Parcourir chaque semaine du mois
      let currentWeek = new Date(firstDayOfMonth);
      while (currentWeek <= lastDayOfMonth) {
        try {
          const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.RESERVATIONS_BY_WEEK}/${currentWeek.toISOString().split('T')[0]}`));
          const result = await response.json();
          
          if (result.success && result.data) {
            // Filtrer les réservations qui sont vraiment dans le mois courant
            const weekReservations = result.data.filter(reservation => {
              const reservationDate = new Date(reservation.date_rdv);
              return reservationDate.getMonth() === currentMonth && 
                     reservationDate.getFullYear() === currentYear;
            });
            allReservations.push(...weekReservations);
          }
        } catch (error) {
          console.warn(`Erreur pour la semaine ${currentWeek.toISOString().split('T')[0]}:`, error);
        }
        
        // Passer à la semaine suivante
        currentWeek.setDate(currentWeek.getDate() + 7);
      }
      
      return allReservations;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations du mois:', error);
      return [];
    }
  };

  // Fonction pour récupérer les données du dashboard pour un mois spécifique
  const fetchDashboardData = async (monthToFetch = selectedMonth) => {
    try {
      setLoadingDashboard(true);
      
      const now = new Date();
      const isCurrentMonth = monthToFetch === `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Récupérer les réservations de la semaine courante (seulement pour le mois actuel)
      let weekReservations = [];
      if (isCurrentMonth) {
        const dateStr = now.toISOString().split('T')[0];
        const weekResponse = await fetch(buildAPIUrl(`${API_ENDPOINTS.RESERVATIONS_BY_WEEK}/${dateStr}`));
        const weekResult = await weekResponse.json();
        
        if (weekResult.success) {
          weekReservations = weekResult.data || [];
          console.log('📊 Dashboard - Réservations de la semaine récupérées:', weekReservations.length);
        }
      }
        
      // Récupérer toutes les réservations du mois sélectionné
      const monthReservations = await fetchAllMonthReservations(monthToFetch);
        
      console.log(`📊 Dashboard - Réservations du mois ${monthToFetch} récupérées:`, monthReservations.length);
        
      // Debug: Afficher un échantillon des données pour vérifier les champs
      if (monthReservations.length > 0) {
        console.log('📊 Debug - Échantillon de réservation:', {
          champsDisponibles: Object.keys(monthReservations[0]),
          type_voiture: monthReservations[0].type_voiture,
          formule: monthReservations[0].formule,
          premiereReservation: monthReservations[0]
        });
        
        // Tester le mapping pour voir si ça fonctionne
        const testVehicleType = monthReservations[0].type_voiture;
        const vehicleTypeMapping = {
          'petite-citadine': 'Petite Citadine',
          'citadine': 'Citadine', 
          'berline': 'Berline',
          'suv': 'SUV / 4x4',
          'non-specifie': 'Non spécifié'
        };
        console.log('📊 Debug - Test mapping:', {
          valeurBrute: testVehicleType,
          valeurMappee: vehicleTypeMapping[testVehicleType] || testVehicleType,
          mappingDisponible: vehicleTypeMapping
        });
      }
        
      // Calculer le chiffre d'affaires du mois
      const monthRevenue = monthReservations.reduce((total, reservation) => {
        return total + (parseFloat(reservation.prix) || 0);
      }, 0);
        
      // Analyser les formules et types de voitures les plus populaires
      const formulaCount = {};
      const vehicleTypeCount = {};
      const formulaVehicleMatrix = {};

      monthReservations.forEach(reservation => {
        // Compter les formules
        const formula = reservation.formule || 'Non spécifiée';
        formulaCount[formula] = (formulaCount[formula] || 0) + 1;

        // Compter les types de véhicules avec extraction robuste
        const vehicleTypeRaw = extractVehicleType(reservation);
        const vehicleTypeMapping = {
          'petite-citadine': 'Petite Citadine',
          'citadine': 'Citadine', 
          'berline': 'Berline',
          'suv': 'SUV / 4x4',
          'non-specifie': 'Non spécifié'
        };
        const vehicleType = vehicleTypeMapping[vehicleTypeRaw] || vehicleTypeRaw || 'Non spécifié';
        vehicleTypeCount[vehicleType] = (vehicleTypeCount[vehicleType] || 0) + 1;

        // Debug pour chaque réservation (seulement les 3 premières)
        if (Object.keys(vehicleTypeCount).length <= 3) {
          console.log(`📊 Debug - Réservation ${Object.keys(vehicleTypeCount).length}:`, {
            champsReservation: Object.keys(reservation),
            vehicleTypeRaw: vehicleTypeRaw,
            vehicleTypeMapped: vehicleType,
            formula: formula
          });
        }

        // Matrice formule x type de véhicule
        const key = `${formula} - ${vehicleType}`;
        formulaVehicleMatrix[key] = (formulaVehicleMatrix[key] || 0) + 1;
      });

      // Log des comptages bruts avant tri et formatage
      console.log('📊 Debug - Comptages bruts:', {
        formulaCount,
        vehicleTypeCount,
        totalReservations: monthReservations.length
      });

      // Trier et formater les résultats
      const popularFormulas = Object.entries(formulaCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([formula, count]) => ({ name: formula, count, percentage: ((count / monthReservations.length) * 100).toFixed(1) }));

      const popularVehicleTypes = Object.entries(vehicleTypeCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4)
        .map(([type, count]) => ({ name: type, count, percentage: ((count / monthReservations.length) * 100).toFixed(1) }));

      const formulaVehicleStats = Object.entries(formulaVehicleMatrix)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([combination, count]) => ({ 
          combination, 
          count, 
          percentage: ((count / monthReservations.length) * 100).toFixed(1) 
        }));

      console.log('📊 Dashboard - Statistiques calculées:', {
        semaine: weekReservations.length,
        mois: monthReservations.length,
        revenus: monthRevenue,
        formulesPopulaires: popularFormulas,
        typesVehicules: popularVehicleTypes,
        debug: {
          formulaCount,
          vehicleTypeCount,
          formulaVehicleMatrix
        }
      });
        
      setDashboardData({
        weekReservations: weekReservations.length,
        monthServices: monthReservations.length,
        monthRevenue: monthRevenue,
        totalReservations: monthReservations.length,
        confirmedReservations: weekReservations.filter(r => r.status === 'confirmed').length,
        pendingReservations: weekReservations.filter(r => r.status === 'pending').length,
        popularFormulas,
        popularVehicleTypes,
        formulaVehicleStats
      });
        
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('❌ Dashboard - Erreur lors de la récupération des données:', error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Fonction pour générer la liste des mois disponibles (12 derniers mois)
  const generateMonthlyHistory = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      months.push({ value: monthStr, label: monthName });
    }
    
    setMonthlyHistory(months);
  };

  // Fonction pour réinitialiser les statistiques du mois (pour simulation)
  const resetMonthlyStats = async () => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser les statistiques du mois sélectionné ?\n\nCette action supprimera toutes les réservations de ce mois (simulation uniquement).')) {
      try {
        console.log(`🔄 Réinitialisation des statistiques pour ${selectedMonth}...`);
        
        // Ici vous pourriez ajouter un appel API pour supprimer les réservations du mois
        // await fetch(buildAPIUrl(`${API_ENDPOINTS.RESERVATIONS}/reset/${selectedMonth}`), { method: 'DELETE' });
        
        // Pour l'instant, on simule en remettant les données à zéro
        setDashboardData({
          weekReservations: 0,
          monthServices: 0,
          monthRevenue: 0,
          totalReservations: 0,
          confirmedReservations: 0,
          pendingReservations: 0,
          popularFormulas: [],
          popularVehicleTypes: [],
          formulaVehicleStats: []
        });
        
        alert('✅ Statistiques réinitialisées avec succès !');
        console.log('✅ Réinitialisation terminée');
        
      } catch (error) {
        console.error('❌ Erreur lors de la réinitialisation:', error);
        alert('❌ Erreur lors de la réinitialisation des statistiques.');
      }
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    generateMonthlyHistory();
  }, []);

  // Charger les données quand le mois sélectionné change
  useEffect(() => {
    fetchDashboardData(selectedMonth);
  }, [selectedMonth]);

  // Auto-rafraîchissement toutes les 2 minutes (seulement pour le mois actuel)
  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (selectedMonth === currentMonth) {
      const interval = setInterval(() => fetchDashboardData(selectedMonth), 120000);
      return () => clearInterval(interval);
    }
  }, [selectedMonth]);

  // Fonction pour générer un rapport PDF
  const generatePDFReport = () => {
    if (dashboardData.monthServices === 0) {
      alert('Aucune donnée disponible pour générer le rapport.');
      return;
    }

    console.log(`📄 Génération du rapport PDF pour ${selectedMonth}...`);
    const currentMonthLabel = monthlyHistory.find(m => m.value === selectedMonth)?.label || selectedMonth;
    const isCurrentMonth = selectedMonth === `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
    
    const reportData = {
      date: new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: new Date().toLocaleTimeString('fr-FR'),
      selectedMonth: currentMonthLabel,
      isCurrentMonth,
      stats: dashboardData,
      popularFormulas: dashboardData.popularFormulas,
      popularVehicleTypes: dashboardData.popularVehicleTypes,
      formulaVehicleStats: dashboardData.formulaVehicleStats
    };

    // Créer le contenu HTML pour le PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport Dashboard - Les AS de L'Auto - ${currentMonthLabel}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #FFA600; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #FFA600; margin-bottom: 10px; }
          .date-info { color: #666; font-size: 14px; }
          .month-info { background: #FFF3E0; border: 1px solid #FFA600; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
          .month-badge { background: #FFA600; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin-bottom: 10px; }
          .section { margin: 30px 0; }
          .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid #FFA600; padding-left: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
          .stat-number { font-size: 24px; font-weight: bold; color: #FFA600; }
          .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
          .list-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .list-item:last-child { border-bottom: none; }
          .rank { font-weight: bold; color: #FFA600; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          .current-month { color: #10B981; font-weight: bold; }
          .historical-month { color: #6B7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🚗 LES AS DE L'AUTO - RAPPORT DASHBOARD</div>
          <div class="date-info">Généré le ${reportData.date} à ${reportData.time}</div>
        </div>

        <div class="month-info">
          <div class="month-badge">
            📅 ${currentMonthLabel}
          </div>
          <div class="${isCurrentMonth ? 'current-month' : 'historical-month'}">
            ${isCurrentMonth ? '🔴 Données du mois en cours' : '📊 Données historiques'}
          </div>
        </div>

        <div class="section">
          <div class="section-title">📊 Statistiques Générales</div>
          <div class="stats-grid">
            ${isCurrentMonth ? `
              <div class="stat-card">
                <div class="stat-number">${dashboardData.weekReservations}</div>
                <div class="stat-label">Réservations cette semaine</div>
              </div>
            ` : ''}
            <div class="stat-card">
              <div class="stat-number">${dashboardData.monthServices}</div>
              <div class="stat-label">Services ${isCurrentMonth ? 'ce mois' : 'ce mois-là'}</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${dashboardData.monthRevenue.toFixed(0)}€</div>
              <div class="stat-label">Revenus ${isCurrentMonth ? 'ce mois' : 'ce mois-là'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">🏆 Formules les Plus Populaires</div>
          ${dashboardData.popularFormulas.map((formula, index) => `
            <div class="list-item">
              <div><span class="rank">#${index + 1}</span> ${formula.name}</div>
              <div>${formula.count} réservations (${formula.percentage}%)</div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <div class="section-title">🚗 Types de Véhicules les Plus Demandés</div>
          ${dashboardData.popularVehicleTypes.map((vehicle, index) => `
            <div class="list-item">
              <div><span class="rank">#${index + 1}</span> ${vehicle.name}</div>
              <div>${vehicle.count} réservations (${vehicle.percentage}%)</div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <div class="section-title">⭐ Combinaisons Populaires (Formule + Véhicule)</div>
          ${dashboardData.formulaVehicleStats.slice(0, 5).map((combo, index) => `
            <div class="list-item">
              <div><span class="rank">#${index + 1}</span> ${combo.combination}</div>
              <div>${combo.count} réservations (${combo.percentage}%)</div>
            </div>
          `).join('')}
        </div>

        <div class="footer">
          <p>Rapport généré automatiquement par le système de gestion Les AS de L'Auto</p>
          <p>📧 Contact: lesasdelauto06@gmail.com | 📞 06 25 13 80 33</p>
          <p style="margin-top: 10px; font-size: 10px;">
            Période analysée: ${currentMonthLabel} • 
            ${isCurrentMonth ? 'Données en temps réel' : 'Archive historique'}
          </p>
        </div>
      </body>
      </html>
    `;

    // Ouvrir une nouvelle fenêtre pour imprimer/sauvegarder en PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Attendre que le contenu soit chargé puis déclencher l'impression
    printWindow.onload = () => {
      printWindow.print();
      console.log('✅ Rapport PDF généré avec succès');
      
      // Notification de succès (optionnel)
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed; 
          top: 20px; 
          right: 20px; 
          background: #10B981; 
          color: white; 
          padding: 12px 20px; 
          border-radius: 8px; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: Arial, sans-serif;
          font-size: 14px;
        ">
          ✅ Rapport PDF généré avec succès !
        </div>
      `;
      document.body.appendChild(notification);
      
      // Supprimer la notification après 3 secondes
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    };
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <motion.div 
            className="p-4 sm:p-6 bg-gray-100 min-h-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header du Dashboard */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                    Tableau de Bord
                  </h1>
                  <p className="text-gray-600">Vue d'ensemble de votre activité</p>
                </div>
                
                {/* Contrôles du dashboard */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                  {/* Sélecteur de mois */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      📅 Mois :
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA600] focus:border-transparent bg-white text-sm"
                      disabled={loadingDashboard}
                    >
                      {monthlyHistory.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => {
                        console.log('🔄 Actualisation manuelle du dashboard demandée');
                        fetchDashboardData(selectedMonth);
                      }}
                      disabled={loadingDashboard}
                      className="px-3 py-2 bg-[#FFA600] text-white rounded-lg hover:bg-[#FF9500] transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
                      whileHover={{ scale: loadingDashboard ? 1 : 1.05 }}
                      whileTap={{ scale: loadingDashboard ? 1 : 0.95 }}
                      title="Actualiser les données"
                    >
                      <i className={`bx ${loadingDashboard ? 'bx-loader-alt animate-spin' : 'bx-refresh'} text-lg`}></i>
                    </motion.button>
                    
                    <motion.button
                      onClick={resetMonthlyStats}
                      disabled={loadingDashboard}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
                      whileHover={{ scale: loadingDashboard ? 1 : 1.05 }}
                      whileTap={{ scale: loadingDashboard ? 1 : 0.95 }}
                      title="Réinitialiser les statistiques du mois"
                    >
                      <i className="bx bx-reset text-lg"></i>
                    </motion.button>
                    
                    <motion.button
                      onClick={generatePDFReport}
                      disabled={loadingDashboard || dashboardData.monthServices === 0}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      whileHover={{ scale: loadingDashboard || dashboardData.monthServices === 0 ? 1 : 1.05 }}
                      whileTap={{ scale: loadingDashboard || dashboardData.monthServices === 0 ? 1 : 0.95 }}
                      title={dashboardData.monthServices === 0 ? 'Aucune donnée à exporter' : 'Générer un rapport PDF'}
                    >
                      <i className="bx bxs-file-pdf text-lg"></i>
                    </motion.button>
                  </div>

                  {/* Informations sur la dernière mise à jour */}
                  {lastUpdate && (
                    <div className="text-sm text-gray-500 lg:text-right">
                      <div>Dernière MAJ: {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-xs">
                        {selectedMonth === `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}` 
                          ? 'Mois actuel' 
                          : 'Historique'
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Indicateur visuel du mois sélectionné */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white rounded-full text-sm font-medium shadow-lg">
                  <i className="bx bx-calendar text-lg"></i>
                  <span>
                    {monthlyHistory.find(m => m.value === selectedMonth)?.label || selectedMonth}
                  </span>
                  {selectedMonth === `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}` && (
                    <span className="animate-pulse">🔴</span>
                  )}
                </div>
                
                {dashboardData.monthServices > 0 && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <i className="bx bx-check-circle"></i>
                    <span>{dashboardData.monthServices} réservations</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Statistiques principales */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Réservations cette semaine */}
              <motion.div 
                className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FFA600]/20 to-orange-500/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-[#FFA600]/20 rounded-xl">
                      <i className="bx bx-calendar-week text-[#FFA600] text-2xl"></i>
                    </div>
                    {loadingDashboard && (
                      <div className="animate-spin w-5 h-5 border-2 border-[#FFA600] border-t-transparent rounded-full"></div>
                    )}
                  </div>
                  <h3 className="text-gray-600 font-medium mb-2">Réservations</h3>
                  <p className="text-4xl font-bold text-[#FFA600] mb-1">
                    {loadingDashboard ? '--' : dashboardData.weekReservations}
                  </p>
                  <p className="text-sm text-gray-500">Cette semaine</p>
                </div>
              </motion.div>

              {/* Services ce mois */}
              <motion.div 
                className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-sky-500/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <i className="bx bx-wrench text-blue-600 text-2xl"></i>
                    </div>
                    {loadingDashboard && (
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    )}
                  </div>
                  <h3 className="text-gray-600 font-medium mb-2">Services</h3>
                  <p className="text-4xl font-bold text-blue-600 mb-1">
                    {loadingDashboard ? '--' : dashboardData.monthServices}
                  </p>
                  <p className="text-sm text-gray-500">Ce mois</p>
                </div>
              </motion.div>

              {/* Revenus ce mois */}
              <motion.div 
                className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative overflow-hidden sm:col-span-2 lg:col-span-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <i className="bx bx-euro text-green-600 text-2xl"></i>
                    </div>
                    {loadingDashboard && (
                      <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    )}
                  </div>
                  <h3 className="text-gray-600 font-medium mb-2">Revenus</h3>
                  <p className="text-4xl font-bold text-green-600 mb-1">
                    {loadingDashboard ? '--' : `${dashboardData.monthRevenue.toFixed(0)}€`}
                  </p>
                  <p className="text-sm text-gray-500">Ce mois</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Analyse des formules et types de véhicules populaires */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              
              {/* Formules les plus populaires */}
              <motion.div 
                className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <i className="bx bx-list-ul text-purple-600 text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Formules Populaires</h3>
                      <p className="text-sm text-gray-500">Ce mois-ci</p>
                    </div>
                  </div>
                  {loadingDashboard && (
                    <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {loadingDashboard ? (
                    <div className="space-y-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-2 bg-gray-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : dashboardData.popularFormulas.length > 0 ? (
                    dashboardData.popularFormulas.map((formula, index) => {
                      // Icônes et couleurs spécifiques pour chaque formule
                      const getFormulaIcon = (formulaName) => {
                        const name = formulaName.toLowerCase();
                        if (name.includes('extérieur') || name.includes('exterieur')) return 'bx-spray-can';
                        if (name.includes('intérieur') || name.includes('interieur')) return 'bxs-car-wash';
                        if (name.includes('intégral') || name.includes('integral') || name.includes('complet')) return 'bx-check-shield';
                        if (name.includes('express') || name.includes('rapide')) return 'bx-time-five';
                        if (name.includes('premium') || name.includes('luxe')) return 'bxs-crown';
                        if (name.includes('détailing') || name.includes('detailing')) return 'bx-diamond';
                        return 'bx-car-wash';
                      };

                      const getFormulaColor = (formulaName) => {
                        const name = formulaName.toLowerCase();
                        if (name.includes('extérieur') || name.includes('exterieur')) return {
                          bg: 'bg-sky-100',
                          text: 'text-sky-600',
                          gradient: 'bg-gradient-to-r from-sky-400 to-sky-600'
                        };
                        if (name.includes('intérieur') || name.includes('interieur')) return {
                          bg: 'bg-green-100',
                          text: 'text-green-600',
                          gradient: 'bg-gradient-to-r from-green-400 to-green-600'
                        };
                        if (name.includes('intégral') || name.includes('integral') || name.includes('complet')) return {
                          bg: 'bg-purple-100',
                          text: 'text-purple-600',
                          gradient: 'bg-gradient-to-r from-purple-400 to-purple-600'
                        };
                        if (name.includes('express') || name.includes('rapide')) return {
                          bg: 'bg-orange-100',
                          text: 'text-orange-600',
                          gradient: 'bg-gradient-to-r from-orange-400 to-orange-600'
                        };
                        if (name.includes('premium') || name.includes('luxe')) return {
                          bg: 'bg-yellow-100',
                          text: 'text-yellow-600',
                          gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                        };
                        if (name.includes('détailing') || name.includes('detailing')) return {
                          bg: 'bg-pink-100',
                          text: 'text-pink-600',
                          gradient: 'bg-gradient-to-r from-pink-400 to-pink-600'
                        };
                        return {
                          bg: 'bg-blue-100',
                          text: 'text-blue-600',
                          gradient: 'bg-gradient-to-r from-blue-400 to-blue-600'
                        };
                      };

                      const formulaColors = getFormulaColor(formula.name);
                      const formulaIcon = getFormulaIcon(formula.name);
                      const rankColors = [
                        'bg-amber-500', 'bg-gray-500', 'bg-orange-500', 'bg-blue-500', 'bg-indigo-500'
                      ];
                      const rankColor = rankColors[index] || 'bg-gray-500';

                      return (
                        <motion.div 
                          key={formula.name}
                          className="relative p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-8 h-8 ${rankColor} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md`}>
                                {index + 1}
                              </span>
                              <div className={`p-2 ${formulaColors.bg} rounded-lg`}>
                                <i className={`bx ${formulaIcon} ${formulaColors.text} text-lg`}></i>
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-gray-800 block">{formula.name}</span>
                              <div className="text-sm text-gray-500">{formula.percentage}% du total mensuel</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${formulaColors.text}`}>{formula.count}</div>
                              <div className="text-xs text-gray-500">réservations</div>
                            </div>
                          </div>
                          
                          {/* Barre de progression */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div 
                                className={`${formulaColors.gradient} h-2 rounded-full relative overflow-hidden`}
                                initial={{ width: 0 }}
                                animate={{ width: `${formula.percentage}%` }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                              >
                                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                              </motion.div>
                            </div>
                          </div>

                          {/* Badge pour le podium */}
                          {index < 3 && (
                            <div className="absolute -top-2 -right-2">
                              <div className={`w-6 h-6 bg-gradient-to-br ${
                                index === 0 ? 'from-yellow-400 to-yellow-600' :
                                index === 1 ? 'from-gray-400 to-gray-600' :
                                'from-orange-400 to-orange-600'
                              } rounded-full flex items-center justify-center shadow-md`}>
                                <i className={`bx ${
                                  index === 0 ? 'bxs-crown' :
                                  index === 1 ? 'bxs-medal' :
                                  'bxs-award'
                                } text-white text-xs`}></i>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  ) : dashboardData.popularVehicleTypes.length === 1 && 
                       dashboardData.popularVehicleTypes[0]?.name === 'Non spécifié' ? (
                    <div className="text-center py-8">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto">
                        <i className="bx bx-error text-yellow-600 text-4xl mb-3"></i>
                        <p className="font-semibold text-yellow-800 mb-2">Types de véhicules non renseignés</p>
                        <p className="text-yellow-700 text-sm mb-4">
                          Vos {dashboardData.monthServices} réservations n'ont pas de type de véhicule spécifié.
                        </p>
                        <div className="text-left text-xs text-yellow-600 bg-yellow-100 p-3 rounded-lg">
                          <p className="font-medium mb-1">💡 Solution :</p>
                          <p>• Vérifiez la console pour les logs de debug</p>
                          <p>• Assurez-vous que le formulaire de réservation enregistre bien le type de véhicule</p>
                          <p>• Consultez la base de données pour vérifier le champ 'type_voiture'</p>
                        </div>
                        <motion.button
                          onClick={() => {
                            console.log('🔍 DEBUG COMPLET - Dashboard:', {
                              dashboardData,
                              derniereFetch: lastUpdate,
                              loadingState: loadingDashboard
                            });
                            console.log('🔍 Actulisation forcée pour debug...');
                            fetchDashboardData();
                          }}
                          className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🔍 Debug données
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <i className="bx bx-data text-3xl mb-2"></i>
                      <p className="font-medium mb-2">Aucune donnée disponible</p>
                      {dashboardData.monthServices > 0 && (
                        <div className="text-sm text-gray-400 max-w-xs mx-auto">
                          <p>Si vous avez des réservations mais qu'elles apparaissent comme "Non spécifié", 
                          vérifiez que les types de véhicules sont bien renseignés lors des réservations.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Types de véhicules les plus demandés */}
              <motion.div 
                className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/20 rounded-xl">
                      <i className="bx bx-car text-indigo-600 text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Types de Véhicules</h3>
                      <p className="text-sm text-gray-500">Ce mois-ci</p>
                    </div>
                  </div>
                  {loadingDashboard && (
                    <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {loadingDashboard ? (
                    <div className="space-y-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-2 bg-gray-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : dashboardData.popularVehicleTypes.length > 0 ? (
                    dashboardData.popularVehicleTypes.map((vehicle, index) => {
                      const colors = ['indigo', 'blue', 'cyan', 'teal'];
                      const color = colors[index % colors.length];
                      
                      // Icônes spécifiques pour chaque type de véhicule
                      const getVehicleIcon = (vehicleType) => {
                        switch (vehicleType) {
                          case 'Petite Citadine': return 'bx-car';
                          case 'Citadine': return 'bxs-car';
                          case 'Berline': return 'bxs-car-mechanic';
                          case 'SUV / 4x4': return 'bxs-truck';
                          default: return 'bx-help-circle';
                        }
                      };

                      // Couleurs spécifiques pour chaque type avec classes CSS complètes
                      const getVehicleColor = (vehicleType) => {
                        switch (vehicleType) {
                          case 'Petite Citadine': return {
                            bg: 'bg-emerald-100',
                            text: 'text-emerald-600',
                            gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                          };
                          case 'Citadine': return {
                            bg: 'bg-blue-100',
                            text: 'text-blue-600',
                            gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
                          };
                          case 'Berline': return {
                            bg: 'bg-purple-100',
                            text: 'text-purple-600',
                            gradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
                          };
                          case 'SUV / 4x4': return {
                            bg: 'bg-orange-100',
                            text: 'text-orange-600',
                            gradient: 'bg-gradient-to-r from-orange-500 to-orange-600'
                          };
                          default: return {
                            bg: 'bg-gray-100',
                            text: 'text-gray-600',
                            gradient: 'bg-gradient-to-r from-gray-500 to-gray-600'
                          };
                        }
                      };

                      const vehicleColors = getVehicleColor(vehicle.name);
                      const vehicleIcon = getVehicleIcon(vehicle.name);

                      return (
                        <motion.div 
                          key={vehicle.name}
                          className="relative p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 ${vehicleColors.bg} rounded-lg`}>
                              <i className={`bx ${vehicleIcon} ${vehicleColors.text} text-xl`}></i>
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-gray-800 block">{vehicle.name}</span>
                              <span className="text-sm text-gray-500">{vehicle.percentage}% du total</span>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${vehicleColors.text}`}>{vehicle.count}</div>
                              <div className="text-xs text-gray-500">réservations</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div 
                              className={`${vehicleColors.gradient} h-3 rounded-full relative overflow-hidden`}
                              initial={{ width: 0 }}
                              animate={{ width: `${vehicle.percentage}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <i className="bx bx-data text-3xl mb-2"></i>
                      <p className="font-medium mb-2">Aucune donnée disponible</p>
                      {dashboardData.monthServices > 0 && (
                        <div className="text-sm text-gray-400 max-w-xs mx-auto">
                          <p>Vérifiez que les formules sont bien enregistrées dans vos réservations.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Combinaisons formule + type de véhicule les plus populaires */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div 
                className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
                whileHover={{ scale: 1.005 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#FFA600] to-orange-500 rounded-xl">
                      <i className="bx bx-stats text-white text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Combinaisons Populaires</h3>
                      <p className="text-sm text-gray-500">Formule × Type de véhicule ce mois-ci</p>
                    </div>
                  </div>
                  {loadingDashboard && (
                    <div className="animate-spin w-5 h-5 border-2 border-[#FFA600] border-t-transparent rounded-full"></div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {loadingDashboard ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-xl"></div>
                      </div>
                    ))
                  ) : dashboardData.formulaVehicleStats.length > 0 ? (
                    dashboardData.formulaVehicleStats.map((stat, index) => (
                      <motion.div 
                        key={stat.combination}
                        className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:from-[#FFA600]/10 hover:to-orange-500/5 hover:border-[#FFA600]/20 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#FFA600] mb-1">{stat.count}</div>
                          <div className="text-xs text-gray-600 font-medium mb-2">{stat.percentage}%</div>
                          <div className="text-sm text-gray-700 leading-tight">
                            {stat.combination.length > 25 ? 
                              `${stat.combination.substring(0, 25)}...` : 
                              stat.combination
                            }
                          </div>
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#FFA600] to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <i className="bx bx-data text-4xl mb-3"></i>
                      <p className="text-lg">Aucune donnée disponible</p>
                      <p className="text-sm">Les statistiques apparaîtront dès que vous aurez des réservations</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

          </motion.div>
        );
      case 'calendar':
        return <Calendar />;
      case 'services':
        return <Services1 />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Bouton Menu Hamburger - visible seulement sur mobile */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
      >
        <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl text-[#FFA600]`}></i>
      </button>

      <div className="flex relative">
        {/* Sidebar */}
        <aside className={`fixed md:relative w-64 bg-white shadow-lg h-screen z-40 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <i className='bx bx-x text-2xl'></i>
              </button>
            </div>
            <nav className="space-y-2">
              <button 
                onClick={() => {
                  setSelectedSection('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  selectedSection === 'dashboard' ? 'bg-[#FFA600] text-white' : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <i className='bx bx-home-alt text-xl'></i>
                Dashboard
              </button>
              
              <button 
                onClick={() => {
                  setSelectedSection('calendar');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  selectedSection === 'calendar' ? 'bg-[#FFA600] text-white' : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <i className='bx bx-calendar-week text-xl'></i>
                Calendrier
              </button>
              
              <button 
                onClick={() => {
                  setSelectedSection('services');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  selectedSection === 'services' ? 'bg-[#FFA600] text-white' : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <i className='bx bx-car text-xl'></i>
                Services
              </button>

              <button 
                onClick={() => {
                  setSelectedSection('settings');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  selectedSection === 'settings' ? 'bg-[#FFA600] text-white' : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <i className='bx bx-cog text-xl'></i>
                Paramètres
              </button>

              <button 
                onClick={handleLogout}
                className="w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50 mt-4"
              >
                <i className='bx bx-log-out text-xl'></i>
                Déconnexion
              </button>
            </nav>
          </div>
        </aside>

        {/* Overlay sombre pour mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 relative z-20">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PanelAdmin; 