import React, { useState, useEffect } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../../config/api.js';
import { Link } from 'react-router-dom';

function PetiteCitadine() {
  const [formules, setFormules] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    duree: '',
    icone: '',
    services: '',
    lavage_premium: false,
    lavage_premium_prix: ''
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [editingFormule, setEditingFormule] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  // Charger les formules au chargement du composant
  useEffect(() => {
    fetchFormules();
  }, []);

  // Fonction pour récupérer les formules
  const fetchFormules = async () => {
    try {
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.PETITE_CITADINE));
      if (!response.ok) throw new Error('Erreur lors de la récupération des formules');
      const data = await response.json();
      setFormules(data);
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };



  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convertir les services en tableau
      const servicesArray = formData.services.split('\n').filter(service => service.trim() !== '');
      
      const dataToSend = {
        ...formData,
        services: servicesArray,
        lavage_premium_prix: formData.lavage_premium_prix === '' ? null : parseFloat(formData.lavage_premium_prix) || null
      };
      
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.PETITE_CITADINE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'ajout de la formule');
      }

      // Réinitialiser le formulaire et afficher le message de succès
      setFormData({
        nom: '',
        prix: '',
        duree: '',
        icone: '',
        services: '',
        lavage_premium: false,
        lavage_premium_prix: ''
      });
      setMessage({ type: 'success', content: 'Formule ajoutée avec succès!' });
      
      // Recharger les formules
      fetchFormules();
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  // Supprimer une formule
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formule ?')) return;
    
    try {
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.PETITE_CITADINE}/${id}`), {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression de la formule');
      
      setMessage({ type: 'success', content: 'Formule supprimée avec succès!' });
      fetchFormules();
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  // Commencer l'édition du prix lavage premium
  const startEditPrice = (formule) => {
    setEditingFormule(formule.id);
    setEditPrice(formule.lavage_premium_prix || '');
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingFormule(null);
    setEditPrice('');
  };

  // Sauvegarder le nouveau prix
  const savePrice = async (id) => {
    try {
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.PETITE_CITADINE}/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lavage_premium_prix: editPrice
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour du prix');
      
      setMessage({ type: 'success', content: 'Prix du Lavage Premium mis à jour avec succès!' });
      setEditingFormule(null);
      setEditPrice('');
      fetchFormules();
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF8C00] via-[#FFA500] to-[#FFA500] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Bouton de retour */}
        <div className="mb-4">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-[#FFA600] rounded-lg hover:bg-white transition-colors shadow-md"
          >
            <i className="bx bx-arrow-back text-lg"></i>
            Retour au Panel Admin
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Formules Petite Citadine</h1>
        
        {/* Message de notification */}
        {message.content && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.content}
          </div>
        )}



        {/* Formulaire d'ajout de formule */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#FFA600]">Ajouter une nouvelle formule</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la formule
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA600]"
                  placeholder="Ex: Lavage Premium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA600]"
                  placeholder="Ex: 45"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée estimée
                </label>
                <input
                  type="text"
                  name="duree"
                  value={formData.duree}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA600]"
                  placeholder="Ex: 1h-1h30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icône (classe Boxicons)
                </label>
                <input
                  type="text"
                  name="icone"
                  value={formData.icone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA600]"
                  placeholder="Ex: bx-car"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services inclus (un par ligne)
              </label>
              <textarea
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA600] h-24"
                placeholder="Ex:&#10;Lavage carrosserie&#10;Nettoyage jantes&#10;Protection céramique"
                required
              ></textarea>
            </div>
            
            {/* Option Lavage Premium */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                name="lavage_premium"
                id="lavage_premium"
                checked={formData.lavage_premium}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="lavage_premium" className="flex-1 cursor-pointer">
                <div className="text-sm font-semibold text-gray-800">💎 Lavage Premium</div>
                <div className="text-xs text-gray-600">
                    Cette formule inclut automatiquement l'option "Lavage Premium" qui remplace les services de pressing
                  </div>
                </label>
              </div>
              {formData.lavage_premium && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix du Lavage Premium (€)
                  </label>
                  <input
                    type="number"
                    name="lavage_premium_prix"
                    value={formData.lavage_premium_prix}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: 120"
                    required={formData.lavage_premium}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#FFA600] text-white rounded-lg hover:bg-[#FF9500] transition-colors"
              >
                Ajouter la formule
              </button>
            </div>
          </form>
        </div>

        {/* Section des formules existantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formules.map((formule) => (
            <div key={formule.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-105">
              <div className="p-4 bg-gradient-to-r from-[#FFA600] to-[#FF8C00] relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <i className={`${formule.icone} text-2xl text-[#FFA600]`}></i>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{formule.nom}</h2>
                    {formule.lavage_premium && (
                      <div className="text-xs text-purple-200 bg-purple-500/30 px-2 py-1 rounded-full inline-block mt-1">
                        💎 Lavage Premium {formule.lavage_premium_prix ? `(+${formule.lavage_premium_prix}€)` : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-2 text-sm mb-4">
                  {formule.services.map((service, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <i className="bx bx-check text-[#FFA600]"></i>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-gradient-to-r from-[#FFA600]/10 to-[#FF8C00]/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-[#FFA600]">{formule.prix}€</div>
                  <p className="text-sm text-gray-600">{formule.duree}</p>
                </div>
                
                {/* Édition du prix Lavage Premium */}
                {formule.lavage_premium && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">💎 Prix Lavage Premium</div>
                    {editingFormule === formule.id ? (
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Prix en €"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => savePrice(formule.id)}
                            className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                          >
                            ✓ Sauver
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                          >
                            ✗ Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-purple-600">
                          {formule.lavage_premium_prix ? `${formule.lavage_premium_prix}€` : 'Non défini'}
                        </span>
                        <button
                          onClick={() => startEditPrice(formule)}
                          className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
                        >
                          ✏️ Modifier
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <button
                  onClick={() => handleDelete(formule.id)}
                  className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PetiteCitadine; 