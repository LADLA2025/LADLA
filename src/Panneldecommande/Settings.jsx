import React, { useState } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../../config/api.js';
import { motion } from 'framer-motion';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Réinitialiser le message quand l'utilisateur tape
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Veuillez saisir votre mot de passe actuel' });
      return false;
    }
    if (!passwordData.newPassword) {
      setMessage({ type: 'error', text: 'Veuillez saisir un nouveau mot de passe' });
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      return false;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit être différent de l\'ancien' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const response = await fetch(buildAPIUrl(API_ENDPOINTS.CHANGE_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors de la modification du mot de passe' });
      }

    } catch (error) {
      console.error('Erreur lors de la modification du mot de passe:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 bg-gray-100 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">Gérez les paramètres de votre compte administrateur</p>
      </motion.div>

      {/* Section Changement de mot de passe */}
      <motion.div variants={itemVariants} className="max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden">
          {/* Fond décoratif */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/5 rounded-full transform -translate-x-12 translate-y-12"></div>
          
          <div className="relative z-10">
            {/* Header de la section */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <i className="bx bx-lock-alt text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Changer le mot de passe</h2>
                <p className="text-sm text-gray-500">Modifiez votre mot de passe de connexion</p>
              </div>
            </div>

            {/* Message de statut */}
            {message.text && (
              <motion.div 
                className={`mb-6 p-4 rounded-xl border ${
                  message.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <i className={`bx ${message.type === 'success' ? 'bx-check-circle' : 'bx-error-circle'} text-lg`}></i>
                  <span className="font-medium">{message.text}</span>
                </div>
              </motion.div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <i className="bx bx-key mr-2 text-blue-600"></i>
                  Mot de passe actuel *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors text-base"
                    placeholder="Saisissez votre mot de passe actuel"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <i className={`bx ${showPasswords.current ? 'bx-hide' : 'bx-show'} text-xl`}></i>
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <i className="bx bx-lock mr-2 text-blue-600"></i>
                  Nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors text-base"
                    placeholder="Saisissez le nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <i className={`bx ${showPasswords.new ? 'bx-hide' : 'bx-show'} text-xl`}></i>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
              </div>

              {/* Confirmer le nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <i className="bx bx-check-shield mr-2 text-blue-600"></i>
                  Confirmer le nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors text-base"
                    placeholder="Confirmez le nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <i className={`bx ${showPasswords.confirm ? 'bx-hide' : 'bx-show'} text-xl`}></i>
                  </button>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Modification en cours...</span>
                    </>
                  ) : (
                    <>
                      <i className="bx bx-save text-xl"></i>
                      <span>Modifier le mot de passe</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Conseils de sécurité */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <i className="bx bx-info-circle text-blue-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Conseils de sécurité</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Utilisez un mot de passe d'au moins 8 caractères</li>
                    <li>• Combinez lettres majuscules, minuscules, chiffres et symboles</li>
                    <li>• Évitez les informations personnelles évidentes</li>
                    <li>• Ne partagez jamais votre mot de passe</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings; 