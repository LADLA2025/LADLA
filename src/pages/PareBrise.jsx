import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

function PareBrise() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white h-[60vh] flex items-center justify-center pt-15 overflow-hidden">
        {/* Image d'arrière-plan */}
        <img
          src="https://parebrise-eco.fr/wp-content/uploads/2025/06/remplacement-parebrise-1024x682.jpg"
          alt="Remplacement de pare-brise professionnel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Cercles d'ambiance */}
        <div className="light-circle circle1" style={{zIndex: 5}}></div>
        <div className="light-circle circle2" style={{zIndex: 5}}></div>
        <div className="light-circle circle3" style={{zIndex: 5}}></div>
        
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/60" style={{zIndex: 6}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-[1000px] mx-auto text-center px-2">
            <h1 className="text-2xl md:text-6xl font-bold mb-4 md:mb-6">
              REMPLACEMENT DE PARE-BRISE
            </h1>
            <p className="text-base md:text-2xl mb-3 md:mb-4 opacity-90">
              Service professionnel rapide et sans tracas
            </p>
            <p className="text-sm md:text-xl mb-6 md:mb-8 opacity-90 font-bold">
              Nous nous occupons de tous les détails et formalités
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <a 
                href="https://wa.me/33650304417?text=Bonjour,%20je%20souhaite%20prendre%20rendez-vous%20pour%20un%20remplacement%20de%20pare-brise" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#FF0000] to-[#FF4500] hover:from-[#CC0000] hover:to-[#FF6600] text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 font-medium group"
              >
                <i className='bx bxl-whatsapp text-2xl'></i>
                <span>Prendre Rendez-vous</span>
              </a>
              <a 
                href="tel:0650304417"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
              >
                <i className='bx bx-phone text-2xl'></i>
                <span>06 50 30 44 17</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Offre Exceptionnelle */}
      <section className="py-12 bg-black text-white relative overflow-hidden">
        <div className="light-circle circle4" style={{zIndex: 1, opacity: 0.3}}></div>
        <div className="light-circle circle5" style={{zIndex: 1, opacity: 0.3}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span data-aos="fade-up" className="inline-block bg-[#FF0000] text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              🎁 OFFRE EXCEPTIONNELLE
            </span>
            <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-bold mb-4">
              Notre Cadeau Pour Vous
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Offre 1 */}
            <div className="bg-gradient-to-br from-[#FF0000] to-[#FF4500] rounded-3xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <i className='bx bx-gift text-4xl'></i>
              </div>
              <div className="text-5xl font-bold mb-2">100€</div>
              <div className="text-xl mb-4">+ Franchise offerte</div>
              <div className="w-full h-1 bg-white/30 mb-4"></div>
              <p className="text-white/90 text-sm">
                Nous vous offrons 100€ ET nous prenons en charge votre franchise
              </p>
            </div>
            
            {/* Offre 2 */}
            <div className="bg-white border-4 border-[#FF0000] rounded-3xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className='bx bx-euro text-4xl text-[#FF0000]'></i>
              </div>
              <div className="text-5xl font-bold text-[#FF0000] mb-2">200€</div>
              <div className="text-xl text-gray-800 mb-4">Au choix</div>
              <div className="w-full h-1 bg-[#FF0000]/30 mb-4"></div>
              <p className="text-gray-600 text-sm">
                Ou bénéficiez directement de 200€ offerts
              </p>
            </div>

            {/* Offre Parrainage */}
            <div className="bg-orange-500 rounded-3xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-orange-600">
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <i className='bx bx-group text-4xl text-white'></i>
              </div>
              <div className="text-3xl font-black text-white mb-1">PARRAINAGE</div>
              <div className="text-white/90 text-xs font-semibold mb-3">Aucune limite !</div>
              <div className="w-full h-1 bg-white/40 mb-4"></div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-bold text-white mb-1">100€</div>
                  <p className="text-white/90 text-xs">Pour vous</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-bold text-white mb-1">100€</div>
                  <p className="text-white/90 text-xs">Pour votre filleul</p>
                </div>
              </div>
              <p className="text-white font-bold text-base mb-3">
                Amenez 10 personnes = 1000€ pour vous !
              </p>
              <p className="text-white/90 text-xs">
                Aucune limite au nombre de parrainages
              </p>
            </div>
          </div>
          
          <p className="text-center mt-8 text-white/70">
            * À vous de choisir l'offre qui vous convient le mieux
          </p>
        </div>
      </section>

      {/* Assurance Bris de Glace */}
      <section className="py-12 bg-black text-white relative overflow-hidden">
        <div className="light-circle circle6" style={{zIndex: 1, opacity: 0.2}}></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold mb-4">
              Vous êtes assuré Bris de Glace ?
            </h2>
            <p data-aos="fade-up" data-aos-delay="200" className="text-2xl text-white/90 mb-8">
              C'est parfait ! Vous n'avez rien à payer
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div data-aos="flip-up" data-aos-delay="100" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all">
                <i className='bx bx-euro text-[#FF0000] text-4xl mb-3'></i>
                <h3 className="font-bold text-lg mb-2">0€ de reste à charge</h3>
                <p className="text-white/80 text-sm">Votre assurance prend tout en charge</p>
              </div>
              <div data-aos="flip-up" data-aos-delay="200" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all">
                <i className='bx bx-happy text-[#FF0000] text-4xl mb-3'></i>
                <h3 className="font-bold text-lg mb-2">Aucun malus</h3>
                <p className="text-white/80 text-sm">Le bris de glace n'impacte pas votre bonus-malus</p>
              </div>
              <div data-aos="flip-up" data-aos-delay="300" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all">
                <i className='bx bx-check-shield text-[#FF0000] text-4xl mb-3'></i>
                <h3 className="font-bold text-lg mb-2">Sans franchise</h3>
                <p className="text-white/80 text-sm">Nous prenons en charge votre franchise</p>
              </div>
            </div>

            <p className="text-white/60 text-sm">
              Nous réalisons un devis gratuit pour les non-assurés.
            </p>
          </div>
        </div>
      </section>

      {/* Nos Avantages */}
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Nos Avantages
            </h2>
            <p data-aos="fade-up" data-aos-delay="100" className="text-xl text-gray-600">
              Un service complet pour votre tranquillité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className='bx bx-car text-[#FF0000] text-3xl'></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Véhicule de courtoisie</h3>
              <p className="text-gray-600 text-sm">Restez mobile pendant l'intervention</p>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className='bx bx-time-five text-[#FF0000] text-3xl'></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Intervention rapide</h3>
              <p className="text-gray-600 text-sm">Remplacement sous 72h</p>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className='bx bx-shield text-[#FF0000] text-3xl'></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Garantie à vie</h3>
              <p className="text-gray-600 text-sm">Intervention garantie à vie</p>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className='bx bx-user-check text-[#FF0000] text-3xl'></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Aide aux démarches</h3>
              <p className="text-gray-600 text-sm">Nous gérons tout avec votre assurance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quand remplacer */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Quand dois-je remplacer mon pare-brise ?
            </h2>
            <p data-aos="fade-up" data-aos-delay="100" className="text-xl text-gray-600">
              Votre pare-brise doit être remplacé dans les cas suivants :
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className='bx bx-error-circle text-[#FF0000] text-3xl'></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">Impact important</h3>
              <p className="text-gray-600 text-center text-sm">
                L'impact est plus gros qu'une pièce de 2 euros
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className='bx bx-scatter-chart text-[#FF0000] text-3xl'></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">Impacts multiples</h3>
              <p className="text-gray-600 text-center text-sm">
                Votre pare-brise compte plus de 3 impacts
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className='bx bx-horizontal-center text-[#FF0000] text-3xl'></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">Fissure</h3>
              <p className="text-gray-600 text-center text-sm">
                Présence d'une ou plusieurs fissures
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className='bx bx-x-circle text-[#FF0000] text-3xl'></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">Pare-brise cassé</h3>
              <p className="text-gray-600 text-center text-sm">
                Le pare-brise est cassé ou trop endommagé
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Avant/Après */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="light-circle circle2" style={{zIndex: 1, opacity: 0.4}}></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Notre Expertise en Images
            </h2>
            <p data-aos="fade-up" data-aos-delay="100" className="text-xl text-gray-600">
              Du diagnostic à la pose : un service professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Avant */}
            <div data-aos="fade-right" className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://www.points.fr/wp-content/uploads/2019/12/comment-reparer-son-pare-brise.png"
                  alt="Pare-brise endommagé"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  Dangereux
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-3xl font-bold mb-2">AVANT</div>
                  <div className="text-sm opacity-90">Pare-brise endommagé</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-2">Impact ou Fissure</h3>
                <p className="text-gray-600">
                  Un pare-brise endommagé compromet votre sécurité et celle de vos passagers.
                </p>
              </div>
            </div>

            {/* Après */}
            <div data-aos="fade-left" className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://www.lebonhommepicard.fr/wp-content/uploads/2025/09/68c7e01805f0d-download.jpg.webp"
                  alt="Pare-brise neuf"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  Sécurisé
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-3xl font-bold mb-2">APRÈS</div>
                  <div className="text-sm opacity-90">Pare-brise neuf</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-2">Remplacement Complet</h3>
                <p className="text-gray-600">
                  Votre nouveau pare-brise offre une visibilité parfaite et restaure l'intégrité structurelle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-[#FF0000] to-[#FF4500] text-white relative overflow-hidden">
        <div className="light-circle circle1" style={{zIndex: 1, opacity: 0.1}}></div>
        <div className="light-circle circle5" style={{zIndex: 1, opacity: 0.1}}></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold mb-6">
              Besoin d'un nouveau pare-brise ?
            </h2>
            <p data-aos="fade-up" data-aos-delay="100" className="text-xl md:text-2xl mb-8 opacity-90">
              Contactez-nous dès maintenant pour un diagnostic gratuit
            </p>
            <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/33650304417?text=Bonjour,%20je%20souhaite%20prendre%20rendez-vous%20pour%20un%20remplacement%20de%20pare-brise"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#FF0000] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i className='bx bxl-whatsapp text-2xl'></i>
                Prendre Rendez-vous
              </a>
              <a 
                href="tel:0625138033"
                className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <i className='bx bx-phone text-2xl'></i>
                06 25 13 80 33
              </a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <i className='bx bx-check-circle'></i>
                <span>Diagnostic gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <i className='bx bx-check-circle'></i>
                <span>Devis immédiat</span>
              </div>
              <div className="flex items-center gap-2">
                <i className='bx bx-check-circle'></i>
                <span>Intervention rapide</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PareBrise;
