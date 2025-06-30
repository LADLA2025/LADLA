import React from 'react';
import berlineImg from '../IMG/berline.png';
import { Link } from 'react-router-dom';

function Berline() {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Berline
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image de la voiture */}
          <div className="relative group">
            <img 
              src={berlineImg} 
              alt="Berline" 
              className="rounded-2xl shadow-lg w-full hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xl font-bold">Exemple de berline</span>
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
                  <span>Grand confort routier</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className='bx bx-check text-[#FFA600]'></i>
                  <span>Finitions haut de gamme</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className='bx bx-check text-[#FFA600]'></i>
                  <span>Espace premium</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className='bx bx-check text-[#FFA600]'></i>
                  <span>Technologies avancées</span>
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
                  <span className="font-bold">35€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lavage Intérieur</span>
                  <span className="font-bold">40€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Forfait Complet</span>
                  <span className="font-bold">70€</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Option traitement cuir</span>
                  <span>+15€</span>
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

export default Berline; 