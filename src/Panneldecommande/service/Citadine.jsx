import React, { useState, useEffect } from 'react';
import { buildAPIUrl, API_ENDPOINTS } from '../../config/api.js';
import { Link } from 'react-router-dom';

function Citadine() {
  const [formules, setFormules] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    duree: '',
    icone: '',
    services: ''
  });
  const [message, setMessage] = useState({ type: '', content: '' });

  // Charger les formules au chargement du composant
  useEffect(() => {
    fetchFormules();
  }, []);

  // Fonction pour récupérer les formules
  const fetchFormules = async () => {
    try {
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.CITADINE));
      if (!response.ok) throw new Error('Erreur lors de la récupération des formules');
      const data = await response.json();
      setFormules(data);
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convertir les services en tableau
      const servicesArray = formData.services.split('\n').filter(service => service.trim() !== '');
      
      const response = await fetch(buildAPIUrl(API_ENDPOINTS.CITADINE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          services: servicesArray
        }),
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
        services: ''
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
      const response = await fetch(buildAPIUrl(`${API_ENDPOINTS.CITADINE}/${id}`), {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression de la formule');
      
      setMessage({ type: 'success', content: 'Formule supprimée avec succès!' });
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
        
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Formules Citadine</h1>
        
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
              <div className="p-4 bg-gradient-to-r from-[#FFA600] to-[#FF8C00]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <i className={`${formule.icone} text-2xl text-[#FFA600]`}></i>
                  </div>
                  <h2 className="text-xl font-bold text-white">{formule.nom}</h2>
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

export default Citadine; 