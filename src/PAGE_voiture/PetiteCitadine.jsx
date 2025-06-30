import React from 'react';
import petiteCitadineImg from '../IMG/petitecitadine.png';
import { Link } from 'react-router-dom';

function PetiteCitadine() {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Petite Citadine
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image de la voiture */}
          <div className="relative group">
            <img 
              src={petiteCitadineImg} 
              alt="Petite Citadine" 
              className="rounded-2xl shadow-lg w-full hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xl font-bold">Exemple de petite citadine</span>
            </div>
          </div>

          {/* Informations et tarifs */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <i className='bx bx-car text-[#FFA600]'></i>
                Caractéristiques
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <i className='bx bx-check text-[#FFA600]'></i>
                  <span>Idéale pour la ville</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className='bx bx-check text-[#FFA600]'></i>
                  <span>Facile à manœuvrer</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className='bx bx-check text-[#FFA600]'></i>
                  <span>Parfaite pour le stationnement</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className='bx bx-check text-[#FFA600]'></i>
                  <span>Économique en carburant</span>
                </li>
              </ul>
            </div>

            {/* Tarifs spécifiques */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <i className='bx bx-euro text-[#FFA600]'></i>
                Tarifs Adaptés
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Lavage Extérieur</span>
                  <span className="font-bold">25€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lavage Intérieur</span>
                  <span className="font-bold">30€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Forfait Complet</span>
                  <span className="font-bold">50€</span>
                </div>
                <Link to="/admin" className="block">
                  <button className="w-full bg-[#FFA600] text-white py-3 rounded-lg hover:bg-[#FF8C00] transition-colors mt-4">
                    Réserver un lavage
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetiteCitadine; 