import React from 'react';
import { Link } from 'react-router-dom';
import petiteCitadineImg from '../IMG/petitecitadine.png';
import citadineImg from '../IMG/citadine.png';
import berlineImg from '../IMG/berline.png';
import suvImg from '../IMG/suv 4x4.png';

function Services1() {
  const services = [
    {
      id: 1,
      title: "Petite Citadine",
      image: petiteCitadineImg,
      description: "Idéale pour la ville, facile à manœuvrer",
      path: "/admin/services/petite-citadine"
    },
    {
      id: 2,
      title: "Citadine",
      image: citadineImg,
      description: "Parfaite pour un usage quotidien",
      path: "/admin/services/citadine"
    },
    {
      id: 3,
      title: "Berline",
      image: berlineImg,
      description: "Confort et élégance",
      path: "/admin/services/berline"
    },
    {
      id: 4,
      title: "SUV 4x4",
      image: suvImg,
      description: "Polyvalence et robustesse",
      path: "/admin/services/suv"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Services de Nettoyage</h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-64 h-64 object-contain mb-6"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h2>
              <p className="text-gray-600 mb-8">{service.description}</p>
              
              <div className="w-full">
                <Link 
                  to={service.path}
                  className="w-full bg-[#FFA600] text-white text-xl font-bold py-6 px-8 rounded-2xl shadow-lg hover:bg-[#FF8C00] transition-all duration-300 flex items-center justify-center gap-4"
                >
                  <i className='bx bx-edit-alt text-2xl'></i>
                  Modifier {service.title}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        <button className="w-full bg-[#FFA600] text-white text-2xl font-bold py-8 px-12 rounded-2xl shadow-lg hover:bg-[#FF8C00] transition-all duration-300 flex items-center justify-center gap-4">
          <i className='bx bx-plus-circle text-3xl'></i>
          Ajouter un nouveau service
        </button>
      </div>
    </div>
  );
}

export default Services1;