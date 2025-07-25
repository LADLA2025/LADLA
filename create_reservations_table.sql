-- Table des réservations pour LADL
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  
  -- Informations client (optionnelles maintenant)
  prenom VARCHAR(100),
  nom VARCHAR(100),
  email VARCHAR(255),
  telephone VARCHAR(20),
  adresse TEXT,
  
  -- Informations véhicule et service (obligatoires)
  type_voiture VARCHAR(50) NOT NULL,
  marque_voiture VARCHAR(100) NOT NULL,
  formule VARCHAR(255) NOT NULL,
  prix DECIMAL(10,2),
  
  -- Informations rendez-vous (obligatoires)
  date_rdv DATE NOT NULL,
  heure_rdv TIME NOT NULL,
  
  -- Informations supplémentaires
  commentaires TEXT,
  newsletter BOOLEAN DEFAULT false,
  
  -- Statut de la réservation
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_reservations_date_rdv ON reservations(date_rdv);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

-- Commentaires pour documenter la table
COMMENT ON TABLE reservations IS 'Table des réservations de services de lavage de véhicules';
COMMENT ON COLUMN reservations.status IS 'Statut: pending, confirmed, cancelled, completed';
COMMENT ON COLUMN reservations.prix IS 'Prix en euros de la formule choisie';
COMMENT ON COLUMN reservations.date_rdv IS 'Date du rendez-vous';
COMMENT ON COLUMN reservations.heure_rdv IS 'Heure du rendez-vous au format HH:MM';

-- Affichage de confirmation
SELECT 'Table reservations créée avec succès!' as message; 