import React from 'react';
import { motion } from 'framer-motion';


function EmailJSConfig() {
  // Configuration EmailJS directement côté client
  const config = {
    serviceId: 'service_7d0793g',
    templateId: 'template_0q2h3np',
    publicKey: '0ygI7AuTVWD9Tc4eB',
    privateKey: 'YuXiN4qIqvvTMnQFNct8T',
    adminEmail: 'lesasdelauto06@gmail.com',
    companyName: 'Les As De L\'Auto',
    companyAddress: 'Votre adresse',
    companyPhone: 'Votre téléphone',
    companyWebsite: 'https://lesasdelauto.com'
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Configuration EmailJS ✅
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            EmailJS configuré côté client - Prêt à envoyer des emails !
          </p>
          
          {/* Statut */}
          <div className="flex justify-center mb-6">
            <motion.div 
              className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 bg-green-100 text-green-800 border border-green-200"
              whileHover={{ scale: 1.02 }}
            >
              <i className="bx bx-check-circle text-lg"></i>
              EmailJS Configuré (Frontend Only)
            </motion.div>
          </div>
        </motion.div>

        {/* Configuration actuelle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <i className="bx bx-envelope text-3xl"></i>
                Configuration Actuelle
              </h2>
              <p className="text-blue-100 mt-2">
                Paramètres EmailJS configurés côté client
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Identifiants EmailJS
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Service ID</label>
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm">
                        {config.serviceId}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Template ID</label>
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm">
                        {config.templateId}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Clé Publique</label>
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm">
                        {config.publicKey}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Informations Entreprise
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email Admin</label>
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                        {config.adminEmail}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nom Entreprise</label>
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                        {config.companyName}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Site Web</label>
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                        {config.companyWebsite}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info importante */}
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <i className="bx bx-info-circle text-blue-600 text-xl mt-0.5"></i>
                  <div>
                    <h4 className="text-blue-800 font-semibold mb-2">EmailJS configuré côté client</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      EmailJS est maintenant configuré directement dans React selon la documentation officielle. 
                      Les emails sont envoyés depuis le navigateur, plus besoin de serveur pour les emails !
                    </p>
                  </div>
                </div>
              </div>

              {/* Guide rapide */}
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <i className="bx bx-check-circle text-green-600 text-xl mt-0.5"></i>
                  <div>
                    <h4 className="text-green-800 font-semibold mb-2">Comment ça marche</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Les emails sont envoyés directement depuis React</li>
                      <li>• Utilise l'API EmailJS officielle</li>
                      <li>• Envoi automatique après chaque réservation</li>
                      <li>• Testez avec le bouton "Tester EmailJS côté client" ci-dessous</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default EmailJSConfig; 