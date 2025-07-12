import React from 'react';
import { Link } from 'react-router-dom';
// Import des images
import img2428 from './imgg/IMG_2428.jpeg';
import img1069 from './imgg/IMG_1069.jpeg';
import img1067 from './imgg/IMG_1067.jpeg';
import img1066 from './imgg/IMG_1066.jpeg';
import img1065 from './imgg/IMG_1065.jpeg';
import img1062 from './imgg/IMG_1062.jpeg';

function Garage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal Design */}
      <div className="relative">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 w-full h-[400px]">
          <img 
            src={img1069} 
            alt="Garage" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>
        </div>

        {/* Contenu principal */}
        <div className="relative">
          <div className="container mx-auto px-4">
            <div className="pt-32 pb-20">
              {/* Carte principale */}
              <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image latérale */}
                  <div className="w-full md:w-5/12 relative">
                    <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent md:bg-gradient-to-r"></div>
                    <img 
                      src={img1069} 
                      alt="Services" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Texte et infos */}
                  <div className="w-full md:w-7/12 p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      Notre Garage
                    </h1>
                    <div className="w-20 h-1 bg-[#FF0000] mb-6"></div>
                    <p className="text-xl text-gray-600 mb-8">
                      Votre partenaire automobile de confiance
                    </p>
                    
                    {/* Infos pratiques */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FF0000]/10 flex items-center justify-center flex-shrink-0">
                          <i className='bx bx-time text-[#FF0000] text-2xl'></i>
                        </div>
                        <div>
                                          <p className="text-gray-900 font-medium">Horaires d'ouverture</p>
                <p className="text-gray-600">Lun-Sam: 9h30-12h30 / 13h30-18h30</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FF0000]/10 flex items-center justify-center flex-shrink-0">
                          <i className='bx bx-phone text-[#FF0000] text-2xl'></i>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">Téléphone</p>
                          <p className="text-gray-600">06 25 13 80 33</p>
                          <p className="text-gray-600">06 50 30 44 17</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FF0000]/10 flex items-center justify-center flex-shrink-0">
                          <i className='bx bx-map text-[#FF0000] text-2xl'></i>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">Adresse</p>
                          <p className="text-gray-600">102 avenue saint Lambert, Nice</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges flottants */}
              <div className="flex justify-center gap-4 -mt-6">
                <a 
                  href="https://wa.me/33650304417?text=Bonjour,%20je%20souhaite%20vous%20contacter%20concernant%20vos%20services%20automobiles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white z-10 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                >
                  <i className='bx bxl-whatsapp mr-2'></i>
                  Contactez-nous
                </a>
                <Link 
                  to="/"
                  className="bg-[#FF0000] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <i className='bx bx-car mr-2'></i>
                  Services Auto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

  
      {/* Section Services */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className='bx bx-car text-white text-3xl'></i>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Lavage</h3>
            <p className="text-gray-600 text-center">Service de lavage professionnel pour tous types de véhicules</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className='bx bx-paint text-white text-3xl'></i>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Carrosserie</h3>
            <p className="text-gray-600 text-center">Réparation et entretien de carrosserie par des experts</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className='bx bx-transfer text-white text-3xl'></i>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Achat & Vente</h3>
            <p className="text-gray-600 text-center">Service d'achat et vente de véhicules d'occasion</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className='bx bx-key text-white text-3xl'></i>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Location</h3>
            <p className="text-gray-600 text-center">Service de location de véhicules pour tous vos besoins</p>
          </div>
        </div>
      </div>

      {/* Galerie Photos - Bento Grid */}
      <div className="bg-gradient-to-br from-[#FF0000] to-orange-600 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Notre Atelier</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Grande carte de présentation */}
            <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF0000] mb-4">
                L'expertise et la passion au service de tous vos besoins automobiles !
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Nous sommes spécialisés dans l'entretien et les services automobiles, allant du lavage intérieur et extérieur (detailing) à la carrosserie, en passant par la location et l'achat/vente de voitures d'occasion. Notre mission : offrir des prestations de qualité et garantir votre satisfaction à chaque étape.
              </p>
            </div>

            {/* Image 1 */}
            <div className="relative overflow-hidden rounded-3xl shadow-lg group h-[300px] transform hover:-translate-y-1 transition-all duration-300">
              <img 
                src={img2428} 
                alt="Service de lavage" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white p-6 font-semibold">Service de lavage professionnel</p>
              </div>
            </div>

            {/* Image 2 */}
            <div className="relative overflow-hidden rounded-3xl shadow-lg group h-[300px] transform hover:-translate-y-1 transition-all duration-300">
              <img 
                src={img1067} 
                alt="Équipement professionnel" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white p-6 font-semibold">Équipement de pointe</p>
              </div>
            </div>

            {/* Image 3 */}
            <div className="relative overflow-hidden rounded-3xl shadow-lg group h-[300px] transform hover:-translate-y-1 transition-all duration-300">
              <img 
                src={img1066} 
                alt="Service carrosserie" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white p-6 font-semibold">Atelier de carrosserie</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Engagement */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Notre Engagement</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Nous nous engageons à fournir des services de qualité supérieure avec une équipe expérimentée et des équipements modernes. 
            Votre satisfaction est notre priorité.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Garage; 
