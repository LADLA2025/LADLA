import React from 'react';

function Accueil() {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bienvenue chez Les AS de L'Auto
        </h1>
        <div className="text-center mb-12">
          <p className="text-xl text-gray-600 mb-4">
            Votre partenaire de confiance pour l'entretien et le nettoyage de votre véhicule
          </p>
          <button className="bg-[#FFA600] text-white px-8 py-3 rounded-lg hover:bg-[#FF8C00] transition-colors">
            Découvrir nos services
          </button>
        </div>
      </div>
    </div>
  );
}

export default Accueil; 