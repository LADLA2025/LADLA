import React from 'react';
import { motion } from 'framer-motion';

function MentionsLegales() {
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
        className="container mx-auto px-4 max-w-4xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-[#FFA600] to-orange-500 rounded-xl">
              <i className="bx bx-file-blank text-white text-3xl"></i>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Mentions Légales
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Informations légales concernant le site web de LES AS DE L'AUTO
          </p>
        </motion.div>

        {/* Contenu principal */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            {/* Éditeur du site */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-[#FFA600]/20 rounded-lg">
                  <i className="bx bx-building text-[#FFA600] text-xl"></i>
                </div>
                Éditeur du site
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <p><strong>Dénomination sociale :</strong> LES AS DE L'AUTO</p>
                <p><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
                <p><strong>Siège social :</strong> LE SANSEVERIA 102 AVENUE SAINT-LAMBERT, 06000 NICE</p>
                <p><strong>Téléphone :</strong> 06.50.30.44.17 / 06.25.13.80.33</p>
                <p><strong>Email :</strong> lesasdelauto06@gmail.com</p>
                <p><strong>SIREN :</strong> 935 272 377</p>
                <p><strong>SIRET :</strong> 935 272 377 00026 (Clef NIC : 00026)</p>
                <p><strong>Code NAF/APE :</strong> 45.20A (Entretien et réparation de véhicules automobiles légers)</p>
                <p><strong>N° TVA Intracommunautaire :</strong> FR90 935 272 377</p>
                <p><strong>Date de création de la société :</strong> 13/11/2024</p>
                <p><strong>Date de création de l'établissement :</strong> 01/12/2024</p>
                <p><strong>Tranche d'effectif salarié :</strong> Unité non employeuse</p>
              </div>
            </section>

            {/* Directeur de publication */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <i className="bx bx-user-check text-blue-600 text-xl"></i>
                </div>
                Directeur de la publication
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6">
                <p>Le directeur de la publication est le représentant légal de LES AS DE L'AUTO.</p>
                <p><strong>Contact :</strong> lesasdelauto06@gmail.com</p>
              </div>
            </section>



            {/* Conception du site */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <i className="bx bx-code-alt text-purple-600 text-xl"></i>
                </div>
                Conception et développement
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6">
                <p>
                  <strong>Développement :</strong> Site web créé par{' '}
                  <a 
                    href="https://rebu1ld.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#FFA600] hover:text-[#FF9500] font-semibold underline"
                  >
                    @rebu1ld.com
                  </a>
                </p>
                <p><strong>Technologies utilisées :</strong> React.js, Node.js, Tailwind CSS</p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <i className="bx bx-copyright text-red-600 text-xl"></i>
                </div>
                Propriété intellectuelle
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <i className="bx bx-building text-[#FFA600]"></i>
                      Propriété LADL - Les AS de L'Auto
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Textes et contenus rédactionnels</li>
                      <li>• Images et photographies</li>
                      <li>• Vidéos et contenus multimédias</li>
                      <li>• Logo et identité visuelle LADL</li>
                      <li>• Marques déposées</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <i className="bx bx-code-alt text-purple-600"></i>
                      Propriété @rebu1ld.com
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Conception graphique du site</li>
                      <li>• Interface utilisateur (UI/UX)</li>
                      <li>• Code source et développement</li>
                      <li>• Architecture technique</li>
                      <li>• Éléments de design web</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <i className="bx bx-info-circle text-yellow-600"></i>
                    Conditions d'utilisation
                  </h4>
                  <div className="text-sm space-y-2">
                    <p>
                      <strong>Contenus LES AS DE L'AUTO :</strong> Toute reproduction, distribution, modification 
                      des textes, images et vidéos est strictement interdite sans l'accord écrit 
                      de LES AS DE L'AUTO.
                    </p>
                    <p>
                      <strong>Conception technique :</strong> Le design, l'interface et le code source 
                      développés par{' '}
                      <a 
                        href="https://rebu1ld.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#FFA600] hover:text-[#FF9500] font-semibold underline"
                      >
                        @rebu1ld.com
                      </a>
                      {' '}sont protégés par le droit d'auteur et ne peuvent être réutilisés 
                      sans autorisation expresse.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Protection des données */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <i className="bx bx-shield-check text-indigo-600 text-xl"></i>
                </div>
                Protection des données personnelles
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <p>
                  LES AS DE L'AUTO s'engage à respecter la confidentialité des données 
                  personnelles collectées sur ce site, conformément au Règlement Général sur 
                  la Protection des Données (RGPD).
                </p>
                <p>
                  Les informations recueillies sont destinées uniquement à LES AS DE L'AUTO 
                  pour le traitement de vos demandes et la gestion de nos services.
                </p>
                <p>
                  Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité 
                  et d'opposition au traitement de vos données personnelles.
                </p>
                <p>
                  <strong>Contact pour les données personnelles :</strong> lesasdelauto06@gmail.com
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <i className="bx bx-cookie text-yellow-600 text-xl"></i>
                </div>
                Gestion des cookies
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <p>
                  Ce site utilise des cookies pour améliorer votre expérience de navigation 
                  et analyser l'audience du site.
                </p>
                <p>
                  Vous pouvez gérer vos préférences de cookies à tout moment en cliquant sur 
                  "Gérer les cookies" en bas de page.
                </p>
                <p>
                  <strong>Types de cookies utilisés :</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Cookies nécessaires (fonctionnement du site)</li>
                  <li>Cookies analytiques (statistiques anonymes)</li>
                  <li>Cookies de préférences (personnalisation)</li>
                  <li>Cookies marketing (publicité ciblée)</li>
                </ul>
              </div>
            </section>

            {/* Responsabilité */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <i className="bx bx-error-circle text-gray-600 text-xl"></i>
                </div>
                Limitation de responsabilité
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <p>
                  LES AS DE L'AUTO s'efforce de fournir des informations exactes et 
                  mises à jour sur ce site. Cependant, nous ne pouvons garantir l'exactitude, 
                  l'exhaustivité ou l'actualité de ces informations.
                </p>
                <p>
                  LES AS DE L'AUTO ne saurait être tenu responsable des dommages directs 
                  ou indirects résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.
                </p>
                <p>
                  L'utilisateur est seul responsable de l'utilisation qu'il fait des informations 
                  contenues sur ce site.
                </p>
              </div>
            </section>

            {/* Droit applicable */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <i className="bx bx-gavel text-orange-600 text-xl"></i>
                </div>
                Droit applicable et juridiction
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <p>
                  Les présentes mentions légales sont régies par le droit français.
                </p>
                <p>
                  En cas de litige, et après échec de toute tentative de résolution amiable, 
                  les tribunaux français seront seuls compétents.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-[#FFA600]/20 rounded-lg">
                  <i className="bx bx-phone text-[#FFA600] text-xl"></i>
                </div>
                Nous contacter
              </h2>
              <div className="bg-gradient-to-r from-[#FFA600]/10 to-orange-500/5 rounded-2xl p-6 space-y-3">
                <p><strong>Email :</strong> lesasdelauto06@gmail.com</p>
                <p><strong>Téléphone :</strong> 06.50.30.44.17 / 06.25.13.80.33</p>
                <p><strong>Adresse :</strong> LE SANSEVERIA 102 AVENUE SAINT-LAMBERT, 06000 NICE</p>
                <p><strong>Horaires :</strong> Du lundi au samedi, 9h30 - 18h30</p>
              </div>
            </section>

            {/* Date de mise à jour */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

          </div>
        </motion.div>

        {/* Bouton retour */}
        <motion.div variants={itemVariants} className="text-center mt-12">
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

export default MentionsLegales; 