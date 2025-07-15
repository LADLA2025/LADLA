import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="bx bx-x text-3xl"></i>
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ServiceCard({ title, icon, description, items, prices, onMoreInfo }) {
  return (
    <motion.div 
      className="group relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
      variants={cardVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-[#FF0000]/10 flex items-center justify-center flex-shrink-0">
            <i className={`bx ${icon} text-3xl text-[#FF0000]`}></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">{title}</h2>
        </div>
        <p className="text-gray-600 mb-6 h-[60px] line-clamp-3">{description}</p>
        <ul className="space-y-3 mb-6 flex-grow">
          {items.map((item, index) => (
            <motion.li 
              key={index}
              className="flex items-start gap-3 group/item hover:bg-[#FF0000]/5 p-2 rounded-lg transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF0000]/10 flex items-center justify-center mt-0.5">
                <i className="bx bx-check text-[#FF0000]"></i>
              </span>
              <span className="text-gray-600 group-hover/item:text-gray-800 transition-colors">{item}</span>
            </motion.li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {prices.map((price, index) => (
            <motion.div
              key={index}
              className="relative group/price bg-gray-50 hover:bg-[#FF0000]/5 rounded-2xl transition-colors h-[100px] flex flex-col items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center w-full px-3">
                <div className="mb-2">
                  <i className="bx bxs-car text-2xl text-[#FF0000] transform group-hover/price:scale-110 transition-transform"></i>
                </div>
                <div className="font-medium text-gray-600 text-sm line-clamp-1 mb-1">{price.type}</div>
                <div className="text-xl font-bold text-[#FF0000]">{price.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="space-y-3 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onMoreInfo}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium hover:from-gray-200 hover:to-gray-300 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <i className="bx bx-info-circle"></i>
            Plus d'infos
          </motion.button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2 font-medium">Réserver pour :</p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/voitures/petite-citadine">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white font-medium hover:from-[#FF4500] hover:to-[#FF6600] transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  Petite Citadine
                </motion.button>
              </Link>
              <Link to="/voitures/citadine">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white font-medium hover:from-[#FF4500] hover:to-[#FF6600] transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  Citadine
                </motion.button>
              </Link>
              <Link to="/voitures/berline">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white font-medium hover:from-[#FF4500] hover:to-[#FF6600] transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  Berline
                </motion.button>
              </Link>
              <Link to="/voitures/suv">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#FF0000] to-[#FF4500] text-white font-medium hover:from-[#FF4500] hover:to-[#FF6600] transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  SUV / 4x4
        </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Tarifs() {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = {
    exterior: {
      title: "Lavage Extérieur",
      icon: "bx-car",
      description: "Un nettoyage complet de l'extérieur de votre véhicule pour une brillance impeccable.",
      items: [
        "Shampoing carrosserie/jantes",
        "Brillance pneus",
        "Rinçage à l'eau claire",
        "Séchage peau de chamois"
      ],
      prices: [
        { type: "Petit citadine", price: "25€" },
        { type: "Citadine", price: "30€" },
        { type: "Berline", price: "35€" },
        { type: "SUV/4x4", price: "40€" }
      ],
      modalContent: (
        <div className="space-y-6">
          <p className="text-gray-600">Notre service de lavage extérieur comprend :</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Processus détaillé</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Pré-rinçage haute pression
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Application du shampoing avec mousse active
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Nettoyage manuel des jantes
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Rinçage haute pression
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Séchage professionnel
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Options supplémentaires</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center justify-between gap-2">
                  <span className="flex-1">Protection céramique</span>
                  <span className="font-semibold text-orange-500 w-20 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span className="flex-1">Traitement anti-pluie</span>
                  <span className="font-semibold text-orange-500 w-20 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span className="flex-1">Cire de protection</span>
                  <span className="font-semibold text-orange-500 w-20 text-right">Sur devis</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-bold text-[#FF0000] mb-4">Durée estimée</h4>
            <div className="flex items-center gap-4 text-gray-600">
              <i className="bx bx-time text-2xl text-[#FF0000]"></i>
              <span>30-45 minutes selon le type de véhicule</span>
            </div>
          </div>
        </div>
      )
    },
    interior: {
      title: "Lavage Intérieur",
      icon: "bx-spray-can",
      description: "Un nettoyage minutieux de l'intérieur pour un habitacle comme neuf.",
      items: [
        "Dépoussiérage complet de l'habitacle",
        "Aspiration en profondeur",
        "Rénovation des plastiques simples",
        "Nettoyage des tapis/moquettes"
      ],
      prices: [
        { type: "Petit citadine", price: "30€" },
        { type: "Citadine", price: "40€" },
        { type: "Berline", price: "50€" },
        { type: "SUV/4x4", price: "60€" }
      ],
      modalContent: (
        <div className="space-y-6">
          <p className="text-gray-600">Notre service de lavage intérieur comprend :</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Processus détaillé</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Aspiration complète (sièges, tapis, coffre)
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Nettoyage des vitres intérieures
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Rénovation des plastiques
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Désodorisation
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Options supplémentaires</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center justify-between gap-2">
                  <span className="flex-1">Shampoing des sièges</span>
                  <span className="font-semibold text-orange-500 w-20 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span className="flex-1">Traitement cuir</span>
                  <span className="font-semibold text-orange-500 w-20 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span className="flex-1">Désinfection à l'ozone</span>
                  <span className="font-semibold text-orange-500 w-20 text-right">Sur devis</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-bold text-[#FF0000] mb-4">Durée estimée</h4>
            <div className="flex items-center gap-4 text-gray-600">
              <i className="bx bx-time text-2xl text-[#FF0000]"></i>
              <span>45-60 minutes selon le type de véhicule</span>
            </div>
          </div>
        </div>
      )
    },
    integral: {
      title: "Lavage Intégral",
      icon: "bx-check-shield",
      description: "La combinaison parfaite du lavage extérieur et intérieur pour une voiture impeccable.",
      items: [
        "Tous les services du lavage extérieur",
        "Tous les services du lavage intérieur",
        "Traitement premium des surfaces",
        "Finitions soignées"
      ],
      prices: [
        { type: "Petit citadine", price: "40€" },
        { type: "Citadine", price: "60€" },
        { type: "Berline", price: "70€" },
        { type: "SUV/4x4", price: "80€" }
      ],
      modalContent: (
        <div className="space-y-6">
          <div className="bg-[#FF0000]/5 rounded-xl p-6 text-center">
            <p className="text-lg text-gray-700">
              Le lavage intégral combine tous les avantages de nos services extérieur et intérieur
              avec une remise attractive sur le prix total.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Services inclus</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Lavage extérieur complet
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Nettoyage intérieur approfondi
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Protection des surfaces
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Désodorisation premium
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Options supplémentaires</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="bx bx-plus text-[#FF0000]"></i>
                  Option Beauté intégrale (Prix personnalisé)
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-plus text-[#FF0000]"></i>
                  Traitement soigner surface
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-plus text-[#FF0000]"></i>
                  Pressing des sièges
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-bold text-[#FF0000] mb-4">Durée estimée</h4>
            <div className="flex items-center gap-4 text-gray-600">
              <i className="bx bx-time text-2xl text-[#FF0000]"></i>
              <span>1h30-2h selon le type de véhicule</span>
            </div>
          </div>
        </div>
      )
    },
    options: {
      title: "Options & Services",
      icon: "bx-cog",
      description: "Toutes nos options, services supplémentaires, protection et rénovation pour personnaliser votre prestation.",
      items: [
        "Options lavage (protection, traitement)",
        "Baume cuir",
        "Services pressing (sièges, tapis, panneaux)",
        "Pressing plafonnier/coffre",
        "Pressing panneaux de porte", 
        "Rénovation chromes",
        "Rénovation phares",
        "Assainissement habitacle ozone",
        "Services spécialisés (polish, lustrage)",
        "Aspiration & dépoussiérage express",
        "Formules sur mesure"
      ],
      prices: [
        { type: "Aspiration express", price: "15€" },
        { type: "Baume cuir", price: "Dès 20€" },
        { type: "Pressing", price: "Dès 30€" },
        { type: "Rénovation", price: "20€-30€" }
      ],
      modalContent: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Options de Lavage & Entretien</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center justify-between gap-2">
                  <span>Aspiration & dépoussiérage</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">15€</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Protection céramique</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Traitement anti-pluie</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Cire de protection</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Shampoing des sièges</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">30€</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Désinfection à l'ozone</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">30€</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Services Pressing</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center justify-between gap-2">
                  <span>Pressing de sièges</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">30€</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Pressing moquette/tapis</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">30€</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Pressing plafonnier/coffre</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">30€</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Pressing panneaux de porte</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">30€</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Baume cuir</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">20€</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Rénovation</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center justify-between gap-2">
                  <span>Renov chrome</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Prix personnalisé selon véhicule 💎</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Rénovation phares</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">30€/unité</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Assainissement ozone</span>
                  <span className="font-semibold text-[#FF0000] w-48 text-right">30€</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Services Sur Devis</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center justify-between gap-2">
                  <span>🔥 Polissage</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Restauration carrosserie personnalisée ✨</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>💎 Lustrage</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Detailing express</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Detailing premium</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Sur devis</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>Lavage moteur</span>
                  <span className="font-semibold text-orange-500 w-48 text-right">Sur devis</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-[#FF0000]/5 rounded-xl p-6">
            <h4 className="font-bold text-[#FF0000] mb-3">💎 Option Premium</h4>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">Lavage Premium (Option Beauté intégrale)</span>
              <span className="text-2xl font-bold text-purple-600">Prix personnalisé</span>
            </div>
                                    <p className="text-gray-600 mt-2">ce service inclus les prestations prenium pressing des sieges des plastiques des tapis</p>
          </div>
        </div>
      )
    },
    vitresteintees: {
      title: "Vitres Teintées",
      icon: "bx-window",
      description: "Service professionnel de pose de vitres teintées.",
      items: [
        "Pose 3/4 ou complète",
        "5 catégories disponibles (A à E)",
        "Dépose disponible",
        "Options sur devis"
      ],
      prices: [
        { type: "Catégorie A", price: "149€-249€" },
        { type: "Catégorie C", price: "249€-349€" },
        { type: "Catégorie E", price: "399€-499€" },
        { type: "Dépose", price: "À partir de 199€" }
      ],
      modalContent: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Tarifs par catégorie</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Pose 3/4</h5>
                  <ul className="space-y-2 text-gray-600">
                    <li>Catégorie A: 149€</li>
                    <li>Catégorie B: 199€</li>
                    <li>Catégorie C: 249€</li>
                    <li>Catégorie D: 299€</li>
                    <li>Catégorie E: 399€</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Pose Complète</h5>
                  <ul className="space-y-2 text-gray-600">
                    <li>Catégorie A: 249€</li>
                    <li>Catégorie B: 299€</li>
                    <li>Catégorie C: 349€</li>
                    <li>Catégorie D: 399€</li>
                    <li>Catégorie E: 499€</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Services additionnels</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Vitre (avant) x2 : 79€
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Dépose complète : à partir de 199€
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Options sur devis (Bris de glace / Pare-brise)
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    unique: {
      title: "Service Unique à Nice",
      icon: "bx-star",
      description: "Services spécialisés exclusifs à Nice.",
      items: [
        "Carrosserie & petits chocs",
        "Débosselage sans peinture",
        "Carrosserie minute",
        "Intervention sur place/domicile"
      ],
      prices: [
        { type: "Carrosserie", price: "Sur devis" },
        { type: "Débosselage", price: "Sur devis" },
        { type: "Intervention", price: "Sur devis" }
      ],
      modalContent: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Nos Services Spéciaux</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Carrosserie & petits chocs
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Débosselage sans peinture (sur rendez-vous)
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Carrosserie minute
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Intervention sur place ou à domicile (sur rendez-vous)
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-[#FF0000] mb-4">Formalités</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="bx bx-check-circle text-[#FF0000]"></i>
                  Prise en charge de toutes les démarches avec votre assurance
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Cercles d'ambiance avec animation */}
      <div className="light-circle circle1 animate-pulse"></div>
      <div className="light-circle circle2 animate-pulse delay-75"></div>
      <div className="light-circle circle3 animate-pulse delay-150"></div>
      <div className="light-circle circle4 animate-pulse delay-300"></div>
      <div className="light-circle circle5 animate-pulse delay-500"></div>
      <div className="light-circle circle6 animate-pulse delay-700"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF0000] to-[#FF4500] inline-block">
            Nos Tarifs
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Des solutions professionnelles adaptées à tous vos besoins
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(services).map(([key, service]) => (
            <ServiceCard
              key={key}
              {...service}
              onMoreInfo={() => {
                setSelectedService(service);
                setIsModalOpen(true);
              }}
            />
          ))}
        </motion.div>

        {/* Contact Footer avec design amélioré */}
        <motion.div 
          className="mt-16 text-center space-y-6 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/90 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all border border-gray-100 w-full max-w-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF0000]/10 flex items-center justify-center flex-shrink-0">
              <i className="bx bx-phone text-2xl text-[#FF0000]"></i>
            </div>
            <span className="text-xl font-medium text-gray-700 text-left">06 25 13 80 33 - 06 50 30 44 17</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/90 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all border border-gray-100 w-full max-w-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF0000]/10 flex items-center justify-center flex-shrink-0">
              <i className="bx bx-map text-2xl text-[#FF0000]"></i>
            </div>
            <span className="text-xl font-medium text-gray-700 text-left">102 avenue saint Lambert, Nice, France</span>
          </motion.div>
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedService?.title}
      >
        {selectedService?.modalContent}
      </Modal>
    </div>
  );
}

export default Tarifs; 
