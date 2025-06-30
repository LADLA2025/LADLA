import React, { useState } from 'react';
import petiteCitadineImg from '../../IMG/petitecitadine.png';

function PetiteCitadine() {
  const [formData, setFormData] = useState({
    exteriorPrice: "25",
    interiorPrice: "30",
    completePrice: "50",
    description: "Idéale pour la ville, facile à manœuvrer",
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de sauvegarde à implémenter
    console.log('Données sauvegardées:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Petite Citadine</h1>
            <p className="text-gray-600">Gérez les détails et tarifs pour les petites citadines</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-[#FFA600] rounded border-gray-300 focus:ring-[#FFA600]"
              />
              <span className="text-gray-700">Service actif</span>
            </label>
          </div>
        </div>

        {/* Aperçu */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-b from-[#F3F3F3] to-[#FFA600]/20">
            <img 
              src={petiteCitadineImg} 
              alt="Petite Citadine" 
              className="absolute inset-0 w-full h-full object-contain p-8"
            />
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Description */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className='bx bx-info-circle text-[#FFA600]'></i>
              Description
            </h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-32 rounded-xl border-gray-300 focus:ring-[#FFA600] focus:border-[#FFA600]"
              placeholder="Description du service..."
            />
          </div>

          {/* Tarifs */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className='bx bx-euro text-[#FFA600]'></i>
              Tarifs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Lavage Extérieur</label>
                <div className="relative">
                  <input
                    type="number"
                    name="exteriorPrice"
                    value={formData.exteriorPrice}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-300 focus:ring-[#FFA600] focus:border-[#FFA600] pl-8"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Lavage Intérieur</label>
                <div className="relative">
                  <input
                    type="number"
                    name="interiorPrice"
                    value={formData.interiorPrice}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-300 focus:ring-[#FFA600] focus:border-[#FFA600] pl-8"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Forfait Complet</label>
                <div className="relative">
                  <input
                    type="number"
                    name="completePrice"
                    value={formData.completePrice}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-300 focus:ring-[#FFA600] focus:border-[#FFA600] pl-8"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#FFA600] text-white py-3 rounded-xl hover:bg-[#FF8C00] transition-colors flex items-center justify-center gap-2"
            >
              <i className='bx bx-save'></i>
              Enregistrer les modifications
            </button>
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <i className='bx bx-reset'></i>
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PetiteCitadine; 