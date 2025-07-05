import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buildAPIUrl, API_ENDPOINTS } from '../config/api.js';
import jsPDF from 'jspdf';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // États pour l'ajout d'un abonné
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    email: '',
    nom: '',
    prenom: '',
    source: 'manual'
  });
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // Charger les données au montage
  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, []);

  // Récupérer tous les abonnés
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(buildAPIUrl(API_ENDPOINTS.NEWSLETTER));
      const result = await response.json();

      if (result.success) {
        setSubscribers(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des abonnés:', error);
      setError('Erreur lors du chargement des abonnés');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.NEWSLETTER_STATS));
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Ajouter un nouvel abonné
  const addSubscriber = async (e) => {
    e.preventDefault();

    if (!newSubscriber.email) {
      alert('Email requis');
      return;
    }

    try {
      setAddingSubscriber(true);

      const response = await fetch(buildAPIUrl(API_ENDPOINTS.NEWSLETTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubscriber)
      });

      const result = await response.json();

      if (result.success) {
        await fetchSubscribers();
        await fetchStats();
        setShowAddModal(false);
        setNewSubscriber({ email: '', nom: '', prenom: '', source: 'manual' });
        alert('Abonné ajouté avec succès !');
      } else {
        alert('Erreur : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de l\'abonné');
    } finally {
      setAddingSubscriber(false);
    }
  };

  // Mettre à jour le statut d'un abonné
  const updateSubscriberStatus = async (id, status) => {
    try {
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.NEWSLETTER}/${id}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();

      if (result.success) {
        await fetchSubscribers();
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

  // Supprimer un abonné
  const deleteSubscriber = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) {
      return;
    }

    try {
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.NEWSLETTER}/${id}`), {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        await fetchSubscribers();
        await fetchStats();
        alert('Abonné supprimé avec succès !');
      } else {
        alert('Erreur : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'abonné');
    }
  };

  // Exporter les abonnés actifs en PDF
  const exportToPDF = async () => {
    try {
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.NEWSLETTER_EXPORT));
      const result = await response.json();

      if (!result.success) {
        alert('Erreur lors de l\'export : ' + result.error);
        return;
      }

      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      let yPosition = 20;

      // Titre
      pdf.setFontSize(18);
      pdf.text('LADL - Liste des Abonnés Newsletter', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
      yPosition += 15;

      // En-têtes
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text('Email', 20, yPosition);
      pdf.text('Nom', 80, yPosition);
      pdf.text('Prénom', 130, yPosition);
      pdf.text('Date d\'inscription', 170, yPosition);
      yPosition += 10;

      pdf.line(20, yPosition - 2, 200, yPosition - 2);
      pdf.setFont(undefined, 'normal');

      // Données
      result.data.forEach((subscriber, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(subscriber.email, 20, yPosition);
        pdf.text(subscriber.nom || 'N/A', 80, yPosition);
        pdf.text(subscriber.prenom || 'N/A', 130, yPosition);
        pdf.text(new Date(subscriber.created_at).toLocaleDateString('fr-FR'), 170, yPosition);
        yPosition += 8;
      });

      // Résumé
      yPosition += 10;
      pdf.setFont(undefined, 'bold');
      pdf.text(`Total abonnés actifs: ${result.count}`, 20, yPosition);

      pdf.save(`newsletter-abonnes-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  // Filtrer les abonnés
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesStatus = filterStatus === 'all' || subscriber.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subscriber.nom && subscriber.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (subscriber.prenom && subscriber.prenom.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'unsubscribed': return 'bg-red-100 text-red-800 border-red-200';
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion Newsletter</h1>
          <p className="text-gray-600">Gérez vos abonnés à la newsletter</p>
        </motion.div>

        {/* Statistiques */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total abonnés</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total || 0}</p>
              </div>
              <i className="bx bx-group text-blue-600 text-3xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Actifs</p>
                <p className="text-3xl font-bold text-green-600">{stats.active || 0}</p>
              </div>
              <i className="bx bx-check-circle text-green-600 text-3xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Inactifs</p>
                <p className="text-3xl font-bold text-orange-600">{stats.inactive || 0}</p>
              </div>
              <i className="bx bx-pause-circle text-orange-600 text-3xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Désabonnés</p>
                <p className="text-3xl font-bold text-red-600">{stats.unsubscribed || 0}</p>
              </div>
              <i className="bx bx-x-circle text-red-600 text-3xl"></i>
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
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="unsubscribed">Désabonnés</option>
              </select>

              {/* Recherche */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par email ou nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#FFA600] focus:outline-none w-full md:w-80"
                />
                <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-[#FFA600] text-white rounded-lg hover:bg-[#FF9500] transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="bx bx-plus"></i>
                Ajouter
              </motion.button>

              <motion.button
                onClick={exportToPDF}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="bx bx-download"></i>
                Export PDF
              </motion.button>

              <motion.button
                onClick={fetchSubscribers}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <i className={`bx ${loading ? 'bx-loader-alt animate-spin' : 'bx-refresh'}`}></i>
                Actualiser
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Liste des abonnés */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Abonnés ({filteredSubscribers.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-[#FFA600] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement des abonnés...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <i className="bx bx-error text-red-500 text-6xl mb-4"></i>
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button 
                onClick={fetchSubscribers}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center">
              <i className="bx bx-inbox text-gray-300 text-6xl mb-4"></i>
              <p className="text-gray-500 text-lg">Aucun abonné trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prénom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber, index) => (
                    <motion.tr
                      key={subscriber.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subscriber.nom || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subscriber.prenom || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscriber.status)}`}>
                          {subscriber.status === 'active' ? 'Actif' : 
                           subscriber.status === 'inactive' ? 'Inactif' : 'Désabonné'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subscriber.source === 'website' ? 'Site web' :
                           subscriber.source === 'reservation' ? 'Réservation' : 'Manuel'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(subscriber.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {subscriber.status !== 'active' && (
                            <button
                              onClick={() => updateSubscriberStatus(subscriber.id, 'active')}
                              className="text-green-600 hover:text-green-900"
                              title="Activer"
                            >
                              <i className="bx bx-check-circle"></i>
                            </button>
                          )}
                          {subscriber.status !== 'inactive' && (
                            <button
                              onClick={() => updateSubscriberStatus(subscriber.id, 'inactive')}
                              className="text-orange-600 hover:text-orange-900"
                              title="Désactiver"
                            >
                              <i className="bx bx-pause-circle"></i>
                            </button>
                          )}
                          {subscriber.status !== 'unsubscribed' && (
                            <button
                              onClick={() => updateSubscriberStatus(subscriber.id, 'unsubscribed')}
                              className="text-gray-600 hover:text-gray-900"
                              title="Désabonner"
                            >
                              <i className="bx bx-x-circle"></i>
                            </button>
                          )}
                          <button
                            onClick={() => deleteSubscriber(subscriber.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Modal d'ajout d'abonné */}
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Ajouter un abonné</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="bx bx-x text-2xl"></i>
                  </button>
                </div>

                <form onSubmit={addSubscriber} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newSubscriber.email}
                      onChange={(e) => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FFA600] focus:outline-none"
                      placeholder="email@exemple.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={newSubscriber.nom}
                        onChange={(e) => setNewSubscriber(prev => ({ ...prev, nom: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FFA600] focus:outline-none"
                        placeholder="Nom"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={newSubscriber.prenom}
                        onChange={(e) => setNewSubscriber(prev => ({ ...prev, prenom: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FFA600] focus:outline-none"
                        placeholder="Prénom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <select
                      value={newSubscriber.source}
                      onChange={(e) => setNewSubscriber(prev => ({ ...prev, source: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#FFA600] focus:outline-none"
                    >
                      <option value="manual">Manuel</option>
                      <option value="website">Site web</option>
                      <option value="reservation">Réservation</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={addingSubscriber}
                      className="flex-1 px-4 py-2 bg-[#FFA600] text-white rounded-lg hover:bg-[#FF9500] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {addingSubscriber ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Ajout...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-plus"></i>
                          Ajouter
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Newsletter; 