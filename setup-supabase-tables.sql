-- Script pour créer toutes les tables nécessaires dans Supabase
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- Table pour les formules petite citadine
CREATE TABLE IF NOT EXISTS formules_petite_citadine (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    duree VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les formules citadine
CREATE TABLE IF NOT EXISTS formules_citadine (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    duree VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les formules berline
CREATE TABLE IF NOT EXISTS formules_berline (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    duree VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les formules SUV
CREATE TABLE IF NOT EXISTS formules_suv (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    duree VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations (déjà créée par le code)
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    -- Informations client
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    adresse TEXT NOT NULL,
    
    -- Informations véhicule et service
    type_voiture VARCHAR(50) NOT NULL,
    marque_voiture VARCHAR(100) NOT NULL,
    formule VARCHAR(255) NOT NULL,
    prix DECIMAL(10,2),
    
    -- Informations rendez-vous
    date_rdv DATE NOT NULL,
    heure_rdv TIME NOT NULL,
    
    -- Informations supplémentaires
    commentaires TEXT,
    newsletter BOOLEAN DEFAULT false,
    
    -- Statut de la réservation
    status VARCHAR(20) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table loginAdmin (déjà créée par le code)
CREATE TABLE IF NOT EXISTS loginAdmin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insérer quelques données d'exemple pour les formules
-- Formules Petite Citadine
INSERT INTO formules_petite_citadine (nom, description, prix, duree) VALUES
('LAVAGE EXPRESS', 'Lavage rapide extérieur', 15.00, '30min'),
('LAVAGE COMPLET', 'Lavage extérieur et intérieur', 25.00, '1h'),
('LAVAGE PREMIUM', 'Lavage complet + cire', 35.00, '1h30')
ON CONFLICT DO NOTHING;

-- Formules Citadine
INSERT INTO formules_citadine (nom, description, prix, duree) VALUES
('LAVAGE EXPRESS', 'Lavage rapide extérieur', 18.00, '30min'),
('LAVAGE COMPLET', 'Lavage extérieur et intérieur', 28.00, '1h'),
('LAVAGE PREMIUM', 'Lavage complet + cire', 38.00, '1h30')
ON CONFLICT DO NOTHING;

-- Formules Berline
INSERT INTO formules_berline (nom, description, prix, duree) VALUES
('LAVAGE EXPRESS', 'Lavage rapide extérieur', 20.00, '30min'),
('LAVAGE COMPLET', 'Lavage extérieur et intérieur', 30.00, '1h'),
('LAVAGE PREMIUM', 'Lavage complet + cire', 40.00, '1h30')
ON CONFLICT DO NOTHING;

-- Formules SUV
INSERT INTO formules_suv (nom, description, prix, duree) VALUES
('LAVAGE EXPRESS', 'Lavage rapide extérieur', 22.00, '30min'),
('LAVAGE COMPLET', 'Lavage extérieur et intérieur', 32.00, '1h'),
('LAVAGE PREMIUM', 'Lavage complet + cire', 42.00, '1h30')
ON CONFLICT DO NOTHING; 