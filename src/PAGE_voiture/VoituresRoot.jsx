import React from 'react';
import { Link } from 'react-router-dom';
import petiteCitadineImg from '../IMG/petitecitadine.png';
import citadineImg from '../IMG/citadine.png';
import berlineImg from '../IMG/berline.png';
import suvImg from '../IMG/suv 4x4.png';

function VoituresRoot() {
  const categories = [
    {
      title: 'Petite Citadine',
      image: petiteCitadineImg,
      path: '/voitures/petite-citadine',
      description: 'Idéale pour la ville',
      startingPrice: '25€'
    },
    {
      title: 'Citadine',
      image: citadineImg,
      path: '/voitures/citadine',
      description: 'Polyvalente ville/route',
      startingPrice: '30€'
    },
    {
      title: 'Berline',
      image: berlineImg,
      path: '/voitures/berline',
      description: 'Grand confort routier',
      startingPrice: '35€'
    },
    {
      title: 'SUV / 4x4',
      image: suvImg,
      path: '/voitures/suv',
      description: 'Espace et robustesse',
      startingPrice: '40€'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Nos Services par Catégorie de Véhicule
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choisissez votre type de véhicule pour découvrir nos services et tarifs adaptés. 
            Chaque catégorie bénéficie d'un traitement spécifique pour des résultats optimaux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              to={category.path} 
              key={category.title}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-[#FFA600] text-white px-4 py-2 rounded-bl-2xl">
                  À partir de {category.startingPrice}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <i className='bx bx-car text-[#FFA600]'></i>
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#FFA600] font-semibold">Voir les détails</span>
                  <i className='bx bx-right-arrow-alt text-[#FFA600] text-2xl'></i>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-100 rounded-2xl p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <i className='bx bx-info-circle text-[#FFA600]'></i>
              Information Importante
            </h2>
            <p className="text-gray-600">
              Les tarifs indiqués sont les prix de base pour chaque catégorie. 
              Des options supplémentaires peuvent être disponibles selon le type de véhicule. 
              Pour plus de détails, cliquez sur la catégorie qui vous intéresse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoituresRoot; 