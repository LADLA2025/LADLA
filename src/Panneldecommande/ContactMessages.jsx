import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buildAPIUrl, API_ENDPOINTS } from '../config/api.js';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Charger les données au montage
  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  // Récupérer tous les messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(buildAPIUrl(API_ENDPOINTS.CONTACT));
      const result = await response.json();

      if (result.success) {
        setMessages(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.CONTACT_STATS));
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Mettre à jour le statut d'un message
  const updateMessageStatus = async (id, status) => {
    try {
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.CONTACT}/${id}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();

      if (result.success) {
        await fetchMessages();
        await fetchStats();
        alert('Statut mis à jour avec succès !');
      } else {
        alert('Erreur : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Supprimer un message
  const deleteMessage = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.CONTACT}/${id}`), {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        await fetchMessages();
        await fetchStats();
        setSelectedMessages(selectedMessages.filter(msgId => msgId !== id));
        alert('Message supprimé avec succès !');
      } else {
        alert('Erreur : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du message');
    }
  };

  // Marquer plusieurs messages comme lus
  const markSelectedAsRead = async () => {
    if (selectedMessages.length === 0) {
      alert('Aucun message sélectionné');
      return;
    }

    try {
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.CONTACT_BULK_READ), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedMessages })
      });

      const result = await response.json();

      if (result.success) {
        await fetchMessages();
        await fetchStats();
        setSelectedMessages([]);
        alert(`${result.data.length} message(s) marqué(s) comme lu(s) !`);
      } else {
        alert('Erreur : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour multiple:', error);
      alert('Erreur lors de la mise à jour multiple');
    }
  };

  // Supprimer plusieurs messages
  const deleteSelectedMessages = async () => {
    if (selectedMessages.length === 0) {
      alert('Aucun message sélectionné');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedMessages.length} message(s) ?`)) {
      return;
    }

    try {
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.CONTACT_BULK_DELETE), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedMessages })
      });

      const result = await response.json();

      if (result.success) {
        await fetchMessages();
        await fetchStats();
        setSelectedMessages([]);
        alert(`${result.data.length} message(s) supprimé(s) !`);
      } else {
        alert('Erreur : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression multiple:', error);
      alert('Erreur lors de la suppression multiple');
    }
  };

  // Ouvrir le modal de lecture d'un message
  const openMessageModal = async (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);

    // Marquer comme lu automatiquement si non lu
    if (message.status === 'unread') {
      await updateMessageStatus(message.id, 'read');
    }
  };

  // Gérer la sélection de messages
  const toggleMessageSelection = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  // Sélectionner/désélectionner tous les messages
  const toggleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(msg => msg.id));
    }
  };

  // Filtrer les messages
  const filteredMessages = messages.filter(message => {
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      message.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 border-red-200';
      case 'read': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages de Contact</h1>
          <p className="text-gray-600">Gérez les messages reçus via le formulaire de contact</p>
        </motion.div>

        {/* Statistiques */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total messages</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total || 0}</p>
              </div>
              <i className="bx bx-message text-blue-600 text-3xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Non lus</p>
                <p className="text-3xl font-bold text-red-600">{stats.unread || 0}</p>
              </div>
              <i className="bx bx-envelope text-red-600 text-3xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Lus</p>
                <p className="text-3xl font-bold text-blue-600">{stats.read || 0}</p>
              </div>
              <i className="bx bx-envelope-open text-blue-600 text-3xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Répondus</p>
                <p className="text-3xl font-bold text-green-600">{stats.replied || 0}</p>
              </div>
              <i className="bx bx-check-circle text-green-600 text-3xl"></i>
            </div>
          </div>
        </motion.div>

        {/* Actions et filtres */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filtre par statut */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#FFA600] focus:outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="unread">Non lus</option>
                <option value="read">Lus</option>
                <option value="replied">Répondus</option>
              </select>

              {/* Recherche */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#FFA600] focus:outline-none w-full md:w-80"
                />
                <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedMessages.length > 0 && (
                <>
                  <motion.button
                    onClick={markSelectedAsRead}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="bx bx-check"></i>
                    Marquer lu ({selectedMessages.length})
                  </motion.button>

                  <motion.button
                    onClick={deleteSelectedMessages}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="bx bx-trash"></i>
                    Supprimer ({selectedMessages.length})
                  </motion.button>
                </>
              )}

              <motion.button
                onClick={fetchMessages}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <i className={`bx ${loading ? 'bx-loader-alt animate-spin' : 'bx-refresh'}`}></i>
                Actualiser
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Liste des messages */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Messages ({filteredMessages.length})
              </h2>
              {filteredMessages.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMessages.length === filteredMessages.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-[#FFA600] border-gray-300 rounded focus:ring-[#FFA600]"
                  />
                  <span className="text-sm text-gray-600">Tout sélectionner</span>
                </label>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-[#FFA600] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement des messages...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <i className="bx bx-error text-red-500 text-6xl mb-4"></i>
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button 
                onClick={fetchMessages}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <i className="bx bx-inbox text-gray-300 text-6xl mb-4"></i>
              <p className="text-gray-500 text-lg">Aucun message trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    message.status === 'unread' ? 'bg-red-50 border-l-4 border-red-500' : ''
                  }`}
                  onClick={() => openMessageModal(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleMessageSelection(message.id);
                        }}
                        className="mt-1 w-4 h-4 text-[#FFA600] border-gray-300 rounded focus:ring-[#FFA600]"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`font-medium ${message.status === 'unread' ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
                            {message.nom}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                            {message.status === 'unread' ? 'Non lu' : 
                             message.status === 'read' ? 'Lu' : 'Répondu'}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-2">
                          <i className="bx bx-envelope mr-1"></i>
                          {message.email}
                        </div>

                        <p className="text-gray-700 text-sm line-clamp-2">
                          {message.message}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleString('fr-FR')}
                          </span>

                          <div className="flex items-center space-x-2">
                            {message.status !== 'read' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateMessageStatus(message.id, 'read');
                                }}
                                className="text-blue-600 hover:text-blue-900 text-sm"
                                title="Marquer comme lu"
                              >
                                <i className="bx bx-check"></i>
                              </button>
                            )}
                            {message.status !== 'replied' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateMessageStatus(message.id, 'replied');
                                }}
                                className="text-green-600 hover:text-green-900 text-sm"
                                title="Marquer comme répondu"
                              >
                                <i className="bx bx-reply"></i>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMessage(message.id);
                              }}
                              className="text-red-600 hover:text-red-900 text-sm"
                              title="Supprimer"
                            >
                              <i className="bx bx-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Modal de lecture de message */}
        {showMessageModal && selectedMessage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800">Message de {selectedMessage.nom}</h2>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status === 'unread' ? 'Non lu' : 
                       selectedMessage.status === 'read' ? 'Lu' : 'Répondu'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="bx bx-x text-2xl"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <div className="text-gray-900">{selectedMessage.email}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Date:</span>
                        <div className="text-gray-900">
                          {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Message:</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowMessageModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Fermer
                    </button>
                    
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: Votre message sur LADL&body=Bonjour ${selectedMessage.nom},%0D%0A%0D%0AMerci pour votre message.%0D%0A%0D%0ACordialement,%0D%0AL'équipe LADL`}
                      className="flex-1 px-4 py-2 bg-[#FFA600] text-white rounded-lg hover:bg-[#FF9500] transition-colors text-center flex items-center justify-center gap-2"
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                    >
                      <i className="bx bx-reply"></i>
                      Répondre par email
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ContactMessages; 