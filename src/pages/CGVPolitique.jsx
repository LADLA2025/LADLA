import React, { useState } from 'react';
import { motion } from 'framer-motion';

function CGVPolitique() {
  const [activeTab, setActiveTab] = useState('cgv');

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
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-5xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-[#FFA600] to-orange-500 rounded-xl">
              <i className="bx bx-file-blank text-white text-3xl"></i>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Conditions Générales & Confidentialité
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conditions générales de vente et politique de confidentialité de LADL - Les AS de L'Auto
          </p>
        </motion.div>

        {/* Onglets */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-lg p-2">
            <button
              onClick={() => setActiveTab('cgv')}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'cgv'
                  ? 'bg-gradient-to-r from-[#FFA600] to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="bx bx-shopping-bag mr-2"></i>
              Conditions Générales de Vente
            </button>
            <button
              onClick={() => setActiveTab('confidentialite')}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'confidentialite'
                  ? 'bg-gradient-to-r from-[#FFA600] to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="bx bx-shield-check mr-2"></i>
              Politique de Confidentialité
            </button>
          </div>
        </motion.div>

        {/* Contenu CGV */}
        {activeTab === 'cgv' && (
          <motion.div
            key="cgv"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <div className="prose prose-lg max-w-none">
              
              {/* Préambule */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#FFA600]/20 rounded-lg">
                    <i className="bx bx-info-circle text-[#FFA600] text-xl"></i>
                  </div>
                  Préambule
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent les relations 
                    contractuelles entre LADL - Les AS de L'Auto, entreprise de nettoyage automobile, 
                    et ses clients.
                  </p>
                  <p>
                    En faisant appel à nos services, le client accepte expressément et sans réserve 
                    les présentes conditions générales de vente.
                  </p>
                </div>
              </section>

              {/* Services proposés */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <i className="bx bx-wrench text-blue-600 text-xl"></i>
                  </div>
                  Services proposés
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p><strong>LADL - Les AS de L'Auto propose les services suivants :</strong></p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Lavage automobile extérieur et intérieur</li>
                    <li>Nettoyage détaillé de véhicules</li>
                    <li>Rénovation de carrosserie</li>
                    <li>Services de nettoyage à domicile</li>
                    <li>Entretien et maintenance automobile</li>
                  </ul>
                  <p>
                    Les services sont détaillés sur notre site internet et peuvent être modifiés 
                    à tout moment sans préavis.
                  </p>
                </div>
              </section>

              {/* Commandes et réservations */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="bx bx-calendar-check text-green-600 text-xl"></i>
                  </div>
                  Commandes et réservations
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    <strong>Prise de commande :</strong> Les commandes peuvent être passées 
                    par téléphone (06.50.30.44.17 / 06.25.13.80.33), par email 
                    (lesasdelauto06@gmail.com) ou via notre site internet.
                  </p>
                  <p>
                    <strong>Confirmation :</strong> Toute commande fait l'objet d'une confirmation 
                    écrite ou orale précisant les services demandés, le prix et la date d'intervention.
                  </p>
                  <p>
                    <strong>Modification :</strong> Toute modification de commande doit être signalée 
                    au moins 24h avant l'intervention prévue.
                  </p>
                </div>
              </section>

              {/* Tarifs et paiement */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="bx bx-euro text-yellow-600 text-xl"></i>
                  </div>
                  Tarifs et modalités de paiement
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    <strong>Tarifs :</strong> Les prix sont indiqués en euros TTC et peuvent être 
                    modifiés à tout moment. Les tarifs appliqués sont ceux en vigueur au moment 
                    de la commande.
                  </p>
                  <p>
                    <strong>Modalités de paiement :</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Espèces</li>
                    <li>Chèque</li>
                    <li>Virement bancaire</li>
                    <li>Carte bancaire (sur demande)</li>
                  </ul>
                  <p>
                    <strong>Facturation :</strong> Le paiement est dû à la fin de la prestation, 
                    sauf accord particulier pour un paiement différé.
                  </p>
                </div>
              </section>

              {/* Exécution des services */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <i className="bx bx-time-five text-purple-600 text-xl"></i>
                  </div>
                  Exécution des services
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    <strong>Délais :</strong> Les interventions sont planifiées selon nos disponibilités. 
                    Les délais annoncés sont donnés à titre indicatif.
                  </p>
                  <p>
                    <strong>Accès au véhicule :</strong> Le client s'engage à fournir un accès libre 
                    et sécurisé au véhicule et à retirer tous objets de valeur.
                  </p>
                  <p>
                    <strong>État du véhicule :</strong> Un contrôle visuel du véhicule est effectué 
                    avant et après intervention. Tout dommage préexistant sera signalé.
                  </p>
                </div>
              </section>

              {/* Annulations et reports */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="bx bx-x-circle text-red-600 text-xl"></i>
                  </div>
                  Annulations et reports
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    <strong>Annulation client :</strong> Toute annulation doit être signalée au moins 
                    24h avant l'intervention. En cas d'annulation tardive, des frais peuvent être appliqués.
                  </p>
                  <p>
                    <strong>Report :</strong> En cas d'impossibilité d'intervention (météo, panne, etc.), 
                    un nouveau rendez-vous sera proposé dans les plus brefs délais.
                  </p>
                </div>
              </section>

              {/* Garanties et responsabilité */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <i className="bx bx-shield-check text-indigo-600 text-xl"></i>
                  </div>
                  Garanties et responsabilité
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    <strong>Garantie qualité :</strong> Nous nous engageons à fournir des services 
                    conformes aux règles de l'art et aux attentes du client.
                  </p>
                  <p>
                    <strong>Assurance :</strong> LADL - Les AS de L'Auto est couvert par une assurance 
                    responsabilité civile professionnelle.
                  </p>
                  <p>
                    <strong>Réclamations :</strong> Toute réclamation doit être signalée dans les 48h 
                    suivant l'intervention pour être prise en compte.
                  </p>
                  <p>
                    <strong>Limitation :</strong> Notre responsabilité est limitée au montant de la 
                    prestation effectuée.
                  </p>
                </div>
              </section>

              {/* Données personnelles */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <i className="bx bx-data text-orange-600 text-xl"></i>
                  </div>
                  Protection des données
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    Les données personnelles collectées sont utilisées uniquement pour la gestion 
                    de la relation client et l'exécution des services.
                  </p>
                  <p>
                    Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, 
                    d'effacement et d'opposition concernant vos données personnelles.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#FFA600]/20 rounded-lg">
                    <i className="bx bx-phone text-[#FFA600] text-xl"></i>
                  </div>
                  Contact et litiges
                </h2>
                <div className="bg-gradient-to-r from-[#FFA600]/10 to-orange-500/5 rounded-2xl p-6 space-y-3">
                  <p><strong>Contact :</strong> lesasdelauto06@gmail.com</p>
                  <p><strong>Téléphone :</strong> 06.50.30.44.17 / 06.25.13.80.33</p>
                  <p><strong>Médiation :</strong> En cas de litige, une solution amiable sera privilégiée.</p>
                  <p><strong>Juridiction :</strong> À défaut, les tribunaux de Nice seront compétents.</p>
                </div>
              </section>

            </div>
          </motion.div>
        )}

        {/* Contenu Politique de confidentialité */}
        {activeTab === 'confidentialite' && (
          <motion.div
            key="confidentialite"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#FFA600]/20 rounded-lg">
                    <i className="bx bx-info-circle text-[#FFA600] text-xl"></i>
                  </div>
                  Introduction
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    LADL - Les AS de L'Auto s'engage à protéger la confidentialité de vos données 
                    personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
                  </p>
                  <p>
                    Cette politique explique comment nous collectons, utilisons, stockons et 
                    protégeons vos informations personnelles.
                  </p>
                </div>
              </section>

              {/* Données collectées */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <i className="bx bx-data text-blue-600 text-xl"></i>
                  </div>
                  Données collectées
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p><strong>Nous collectons les données suivantes :</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Données d'identification :</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Nom et prénom</li>
                        <li>Adresse email</li>
                        <li>Numéro de téléphone</li>
                        <li>Adresse postale</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Données techniques :</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Adresse IP</li>
                        <li>Type de navigateur</li>
                        <li>Pages visitées</li>
                        <li>Cookies de navigation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Finalités du traitement */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="bx bx-target-lock text-green-600 text-xl"></i>
                  </div>
                  Finalités du traitement
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p><strong>Vos données sont utilisées pour :</strong></p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Gérer vos commandes et réservations</li>
                    <li>Vous contacter concernant nos services</li>
                    <li>Améliorer la qualité de nos prestations</li>
                    <li>Respecter nos obligations légales</li>
                    <li>Analyser l'utilisation de notre site web</li>
                    <li>Vous envoyer des informations commerciales (avec consentement)</li>
                  </ul>
                </div>
              </section>

              {/* Base légale */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <i className="bx bx-gavel text-purple-600 text-xl"></i>
                  </div>
                  Base légale du traitement
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Exécution du contrat :</h4>
                      <p className="text-sm">Gestion des commandes et prestations de services</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Intérêt légitime :</h4>
                      <p className="text-sm">Amélioration de nos services et relation client</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Consentement :</h4>
                      <p className="text-sm">Newsletter et communications marketing</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Obligation légale :</h4>
                      <p className="text-sm">Facturation et obligations comptables</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Durée de conservation */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="bx bx-time text-yellow-600 text-xl"></i>
                  </div>
                  Durée de conservation
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">Données clients actifs :</h4>
                        <p className="text-sm text-gray-600">3 ans après la dernière commande</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Données de facturation :</h4>
                        <p className="text-sm text-gray-600">10 ans (obligation légale)</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">Cookies analytiques :</h4>
                        <p className="text-sm text-gray-600">13 mois maximum</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Newsletter :</h4>
                        <p className="text-sm text-gray-600">Jusqu'à désinscription</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Partage des données */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="bx bx-share-alt text-red-600 text-xl"></i>
                  </div>
                  Partage des données
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    <strong>Vos données ne sont jamais vendues ou louées à des tiers.</strong>
                  </p>
                  <p>Elles peuvent être partagées uniquement avec :</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nos prestataires techniques (hébergement, maintenance)</li>
                    <li>Nos partenaires de paiement (si applicable)</li>
                    <li>Les autorités compétentes (sur demande légale)</li>
                  </ul>
                  <p>
                    Tous nos prestataires sont soumis à des obligations de confidentialité 
                    et de sécurité strictes.
                  </p>
                </div>
              </section>

              {/* Vos droits */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <i className="bx bx-user-check text-indigo-600 text-xl"></i>
                  </div>
                  Vos droits RGPD
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p><strong>Vous disposez des droits suivants :</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-green-700">✓ Droit d'accès</h4>
                        <p className="text-sm">Consulter vos données personnelles</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700">✓ Droit de rectification</h4>
                        <p className="text-sm">Corriger vos informations</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700">✓ Droit d'effacement</h4>
                        <p className="text-sm">Supprimer vos données</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-purple-700">✓ Droit de portabilité</h4>
                        <p className="text-sm">Récupérer vos données</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-700">✓ Droit d'opposition</h4>
                        <p className="text-sm">Refuser certains traitements</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">✓ Droit de limitation</h4>
                        <p className="text-sm">Restreindre le traitement</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-[#FFA600]/10 rounded-xl">
                    <p className="text-sm">
                      <strong>Pour exercer vos droits :</strong> Contactez-nous à 
                      lesasdelauto06@gmail.com en précisant votre demande et en joignant 
                      une copie de votre pièce d'identité.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sécurité */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <i className="bx bx-shield text-orange-600 text-xl"></i>
                  </div>
                  Sécurité des données
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles 
                    appropriées pour protéger vos données personnelles :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Chiffrement des données sensibles</li>
                    <li>Accès limité aux données autorisées</li>
                    <li>Sauvegarde régulière et sécurisée</li>
                    <li>Formation du personnel à la protection des données</li>
                    <li>Audit de sécurité régulier</li>
                  </ul>
                </div>
              </section>

              {/* Contact DPO */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#FFA600]/20 rounded-lg">
                    <i className="bx bx-phone text-[#FFA600] text-xl"></i>
                  </div>
                  Contact et réclamations
                </h2>
                <div className="bg-gradient-to-r from-[#FFA600]/10 to-orange-500/5 rounded-2xl p-6 space-y-3">
                  <p><strong>Délégué à la Protection des Données :</strong> lesasdelauto06@gmail.com</p>
                  <p><strong>Téléphone :</strong> 06.50.30.44.17 / 06.25.13.80.33</p>
                  <p><strong>Adresse :</strong> 102 avenue Saint Lambert, 06100 Nice</p>
                  <p className="mt-4 pt-4 border-t border-gray-200">
                    <strong>Réclamation CNIL :</strong> Si vous estimez que vos droits ne sont pas 
                    respectés, vous pouvez déposer une réclamation auprès de la CNIL 
                    (www.cnil.fr).
                  </p>
                </div>
              </section>

            </div>
          </motion.div>
        )}

        {/* Date de mise à jour */}
        <motion.div variants={itemVariants} className="text-center mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-gray-500">
            <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </motion.div>

        {/* Bouton retour */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFA600] to-orange-500 text-white font-semibold rounded-2xl hover:from-[#FF9500] hover:to-orange-600 transition-all duration-200 shadow-lg"
          >
            <i className="bx bx-arrow-back"></i>
            Retour
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CGVPolitique; 