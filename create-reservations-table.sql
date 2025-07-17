-- Création de la table reservations pour Supabase
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

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reservations_date_rdv ON reservations(date_rdv);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_type_voiture ON reservations(type_voiture);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

-- Ajouter une contrainte pour vérifier le statut
ALTER TABLE reservations 
ADD CONSTRAINT check_status 
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Commentaires sur la table
COMMENT ON TABLE reservations IS 'Table des réservations pour Les AS de l''Auto';
COMMENT ON COLUMN reservations.status IS 'Statut: pending, confirmed, cancelled, completed';
COMMENT ON COLUMN reservations.type_voiture IS 'Type: petite-citadine, citadine, berline, suv';

-- Script pour mettre à jour une table existante (si nécessaire)
-- Décommentez les lignes suivantes si vous devez modifier une table existante
/*
ALTER TABLE reservations 
  ALTER COLUMN prenom DROP NOT NULL,
  ALTER COLUMN nom DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN telephone DROP NOT NULL,
  ALTER COLUMN adresse DROP NOT NULL;
*/ 