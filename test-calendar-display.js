// Script de test pour vérifier l'affichage des réservations dans le calendrier
const API_BASE_URL = 'https://ladla.onrender.com';

// Fonction pour tester l'API des réservations
async function testReservationsAPI() {
  try {
    console.log('🔍 Test de l\'API des réservations...');
    
    // Test 1: Récupérer toutes les réservations
    console.log('\n📋 Test 1: Toutes les réservations');
    const allReservationsResponse = await fetch(`${API_BASE_URL}/api/reservations`);
    const allReservations = await allReservationsResponse.json();
    console.log('Réponse API (toutes):', allReservations);
    
    if (allReservations.success && allReservations.data.length > 0) {
      console.log(`✅ ${allReservations.data.length} réservations trouvées`);
      console.log('Première réservation:', allReservations.data[0]);
    } else {
      console.log('❌ Aucune réservation trouvée');
      return;
    }
    
    // Test 2: Récupérer les réservations de la semaine courante
    console.log('\n📅 Test 2: Réservations de la semaine courante');
    const today = new Date().toISOString().split('T')[0];
    const weekResponse = await fetch(`${API_BASE_URL}/api/reservations/semaine/${today}`);
    const weekReservations = await weekResponse.json();
    console.log('Réponse API (semaine):', weekReservations);
    
    if (weekReservations.success) {
      console.log(`✅ ${weekReservations.data.length} réservations cette semaine`);
      console.log('Période:', weekReservations.semaine);
      
      // Analyser les types de voitures
      const vehicleTypes = {};
      weekReservations.data.forEach(res => {
        vehicleTypes[res.type_voiture] = (vehicleTypes[res.type_voiture] || 0) + 1;
      });
      
      console.log('\n🚗 Répartition par type de véhicule:');
      Object.entries(vehicleTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count} réservation(s)`);
      });
      
      // Test de formatage des dates comme dans le calendrier
      console.log('\n📊 Test formatage dates pour calendrier:');
      weekReservations.data.forEach(reservation => {
        const dateString = reservation.date_rdv.split('T')[0];
        const formattedDate = dateString;
        const time = reservation.heure_rdv.substring(0, 5);
        
        console.log(`  - ${reservation.prenom} ${reservation.nom}: ${formattedDate} à ${time} (${reservation.type_voiture})`);
      });
      
    } else {
      console.log('❌ Erreur récupération semaine:', weekReservations.error);
    }
    
    // Test 3: Créer une réservation de test
    console.log('\n🧪 Test 3: Création d\'une réservation de test');
    const testReservation = {
      prenom: 'Test',
      nom: 'Calendar',
      email: 'test@example.com',
      telephone: '0123456789',
      adresse: '123 Rue de Test, 06000 Nice',
      typeVoiture: 'citadine',
      marqueVoiture: 'Renault',
      formule: 'Lavage Complet',
      prix: 25,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Demain
      heure: '14:00',
      commentaires: 'Réservation de test pour vérifier l\'affichage calendrier',
      newsletter: false
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testReservation)
    });
    
    const createResult = await createResponse.json();
    console.log('Résultat création:', createResult);
    
    if (createResult.success) {
      console.log('✅ Réservation de test créée avec succès');
      console.log('ID:', createResult.data.id);
      
      // Attendre un peu puis vérifier si elle apparaît
      setTimeout(async () => {
        console.log('\n🔄 Vérification après création...');
        const verifyResponse = await fetch(`${API_BASE_URL}/api/reservations/semaine/${today}`);
        const verifyResult = await verifyResponse.json();
        
        if (verifyResult.success) {
          const testRes = verifyResult.data.find(r => r.id === createResult.data.id);
          if (testRes) {
            console.log('✅ Réservation de test trouvée dans la semaine');
            console.log('Détails:', testRes);
          } else {
            console.log('❌ Réservation de test non trouvée dans la semaine');
          }
        }
      }, 2000);
      
    } else {
      console.log('❌ Erreur création réservation:', createResult.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Lancer le test
testReservationsAPI(); 