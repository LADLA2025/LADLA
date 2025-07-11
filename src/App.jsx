import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import './App.css'
import "aos/dist/aos.css"; 
import 'boxicons'
import AOS from 'aos';
import backgroundImg from './IMG/background.jpg';
import cercle1Video from './video/cercle1.mp4';

import cercle3Video from './video/cercle3.mp4';
import cercle4Video from './video/cercle4.mp4';
import petiteCitadineImg from './IMG/petitecitadine.png';
import citadineImg from './IMG/citadine.png';
import berlineImg from './IMG/berline.png';
import suvImg from './IMG/suv 4x4.png';
import AnimatedButton from './components/AnimatedButton';

// Composant vidéo optimisé pour mobile
const OptimizedVideo = ({ src, className, children, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      // Tenter de jouer la vidéo après chargement
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log('Autoplay prevented:', e);
          // Si autoplay échoue, on n'affiche pas d'erreur
        });
      }
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Si erreur, on retourne un div vide avec la même classe pour maintenir la mise en page
  if (hasError) {
    return <div className={className} style={{ backgroundColor: 'transparent' }} />;
  }

  return (
    <video 
      ref={videoRef}
      className={className}
      {...props}
    >
      <source src={src} type="video/mp4" />
      {children}
    </video>
  );
};

function App() {
  const [openFaq, setOpenFaq] = useState(null);
  
  useEffect(() => {
    AOS.init();
    
    // Forcer le démarrage des vidéos sur mobile
    const handleUserInteraction = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (video.paused) {
          video.play().catch(e => {
            console.log('Autoplay prevented:', e);
          });
        }
      });
    };

    // Écouter les interactions utilisateur
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    // Nettoyage
    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqData = [
    {
      question: "Quels services proposez-vous ?",
      icon: 'bx-car',
      answer: (
        <>
          <p className="text-gray-600 leading-relaxed">
            Nous offrons une gamme complète de services automobile, notamment :
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2 text-gray-600">
              <i className='bx bx-check text-[#FF0000]'></i>
              Lavage intérieur et extérieur (détailing)
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <i className='bx bx-check text-[#FF0000]'></i>
              Carrosserie
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <i className='bx bx-check text-[#FF0000]'></i>
              Vente et achat de voitures d'occasion
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <i className='bx bx-check text-[#FF0000]'></i>
              Location de véhicules
            </li>
          </ul>
        </>
      )
    },
    {
      question: "Comment réserver un lavage ou un service ?",
      icon: 'bx-calendar',
      answer: "Vous pouvez facilement réserver nos services via notre page de réservation en ligne, ou en nous contactant directement par téléphone au 06.50.30.44.17 / 06 25 13 80 33 ou par email à lesasdelauto06@gmail.com."
    },
    {
      question: "Offrez-vous des services de lavage détaillé ?",
      icon: 'bx-water',
      answer: "Oui, nous proposons un service de detailing complet, comprenant le lavage intérieur et extérieur minutieux de votre véhicule pour un nettoyage en profondeur."
    },
    {
      question: "Quelles sont les conditions de location de véhicule ?",
      icon: 'bx-key',
      answer: "Nous proposons des véhicules à louer pour des durées variées. Pour connaître les conditions et les tarifs, rendez-vous sur notre page \"Location\" ou contactez-nous directement."
    },
    {
      question: "Où êtes-vous situés et quels sont vos horaires d'ouverture ?",
      icon: 'bx-map',
      answer: "Nous sommes situés au 102 avenue Saint Lambert, 06100 Nice. Nos horaires d'ouverture sont du lundi au samedi, de 9h30 à 12h30 et de 13h30 à 18h30."
    },
    {
      question: "Puis-je vous confier ma voiture pour une réparation de carrosserie ?",
      icon: 'bx-wrench',
      answer: "Oui, nous prenons en charge les réparations de carrosserie, quelle que soit l'ampleur des dégâts. Contactez-nous pour obtenir un devis personnalisé."
    },
    {
      question: "Comment puis-je vous contacter ?",
      icon: 'bx-phone',
      answer: "Vous pouvez nous joindre par téléphone au 06.50.30.44.17 / 06 25 13 80 33, par email à lesasdelauto06@gmail.com ou via nos réseaux sociaux."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white h-[85vh] flex items-center justify-center pt-15 overflow-hidden">
         {/* Image d'arrière-plan */}
         <img
           src={backgroundImg}
           alt="Les AS de L'Auto - Votre partenaire automobile de confiance"
           className="absolute inset-0 w-full h-full object-cover"
         />
         
         {/* Cercles d'ambiance animés - AVANT l'overlay */}
         <div className="light-circle circle1" style={{zIndex: 5}}></div>
         <div className="light-circle circle2" style={{zIndex: 5}}></div>
         <div className="light-circle circle3" style={{zIndex: 5}}></div>
         <div className="light-circle circle4" style={{zIndex: 5}}></div>
         <div className="light-circle circle5" style={{zIndex: 5}}></div>
         <div className="light-circle circle6" style={{zIndex: 5}}></div>
         
         {/* Overlay sombre pour la lisibilité */}
         <div className="absolute inset-0 bg-black/60" style={{zIndex: 6}}></div>
         
         <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-[1000px] mx-auto text-left md:text-center">
             <h1 className="text-2xl md:text-6xl font-bold mb-6">
             VOTRE PARTENAIRE AUTOMOBILE DE CONFIANCE
             </h1>
             <p className="text-sm md:text-xl mb-8 opacity-90">
               Notre équipe assure l'entretien esthétique complet et professionnel 
               de votre véhicule avec des outils performants dans un centre 
               équipé et moderne
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-start md:justify-center items-start md:items-center">
               <a 
                 href="https://wa.me/33650304417?text=Bonjour,%20je%20souhaite%20réserver%20un%20service%20de%20nettoyage%20automobile" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-gradient-to-r from-[#FF0000] to-[#FF4500] hover:from-[#CC0000] hover:to-[#FF6600] text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 font-medium group"
               >
                 <i className='bx bxl-whatsapp text-2xl'></i>
                 <span>WhatsApp</span>
               </a>
               <div className="flex items-center gap-2">
                 <a href="https://www.instagram.com/les_as_de_lauto_06/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                   <i className='bx bxl-instagram text-3xl'></i>
                 </a>
                 <a href="https://www.snapchat.com/explore/lesasdelauto06" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                   <i className='bx bxl-snapchat text-4xl'></i>
                 </a>
               </div>
             </div>
           </div>
         </div>
       </section>

      {/* Services Section */}
      <section className="py-46 bg-white relative overflow-hidden w-full">
      
        
        <div className="container mx-auto px-4 md:px-0 relative z-10 w-full">
          <div className="text-center mb-8 mt-[-120px] w-full">
            <h2 data-aos="fade-up" className="text-5xl text-left  font-bold text-black mb-12">
            Réservez votre nettoyage automobile !
            </h2>
            <p className="text-gray-600 text-lg mt-[-20px] text-left">
              Profitez de notre service de lavage au programme. Auto, Nettoyage 
              des équipements et pièces, vos besoins clefs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Petite Citadine */}
            <Link to="/voitures/petite-citadine" className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-60 bg-gradient-to-b from-[#F3F3F3] via-[#FF0000] to-[#FF4500] flex items-center justify-center p-3 relative">
                <div className="absolute inset-0 flex items-start justify-center pt-6">
                  <span data-aos="fade-up" data-aos-duration="2000" className="text-white text-4xl font-bold opacity-40">PETITE CITADINE</span>
                </div>
                <img src={petiteCitadineImg} alt="Petite Citadine" className="max-w-50 max-h-full object-contain relative z-10 hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="pt-8 pb-6 px-4">
                <h3 className="font-bold text-xl mb-4">PETITE CITADINE</h3>
                <p className="text-gray-600 text-base mb-6">
                  Découvrez nos formules de nettoyage adaptées à votre petite citadine.
                </p>
                <AnimatedButton />
              </div>
            </Link>

            {/* Citadine */}
            <Link to="/voitures/citadine" className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-60 bg-gradient-to-b from-[#F3F3F3] via-[#FF0000] to-[#FF4500] flex items-center justify-center p-3 relative">
                <div className="absolute inset-0 flex items-start justify-center pt-6">
                  <span data-aos="fade-up" data-aos-duration="2000" className="text-white text-4xl font-bold opacity-40">CITADINE</span>
                </div>
                <img src={citadineImg} alt="Citadine" className="max-w-118 max-h-full object-contain relative z-10 hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="pt-8 pb-6 px-4">
                <h3 className="font-bold text-xl mb-4">CITADINE</h3>
                <p className="text-gray-600 text-base mb-6">
                  Découvrez nos formules de nettoyage adaptées à votre citadine.
                </p>
                <AnimatedButton />
              </div>
            </Link>

            {/* Berline */}
            <Link to="/voitures/berline" className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-60 bg-gradient-to-b from-[#F3F3F3] via-[#FF0000] to-[#FF4500] flex items-center justify-center p-3 relative">
                <div className="absolute inset-0 flex items-start justify-center pt-6">
                  <span data-aos="fade-up" data-aos-duration="2000" className="text-white text-4xl font-bold opacity-40">BERLINE</span>
                </div>
                <img src={berlineImg} alt="Berline" className="max-w-56 max-h-full object-contain relative z-10 hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="pt-8 pb-6 px-4">
                <h3 className="font-bold text-xl mb-4">BERLINE</h3>
                <p className="text-gray-600 text-base mb-6">
                  Découvrez nos formules de nettoyage adaptées à votre berline.
                </p>
                <AnimatedButton />
              </div>
            </Link>

            {/* SUV 4x4 */}
            <Link to="/voitures/suv" className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-60 bg-gradient-to-b from-[#F3F3F3] via-[#FF0000] to-[#FF4500] flex items-center justify-center p-3 relative">
                <div className="absolute inset-0 flex items-start justify-center pt-6">
                  <span data-aos="fade-up" data-aos-duration="2000" className="text-white text-4xl font-bold opacity-40">SUV 4X4</span>
                </div>
                <img src={suvImg} alt="SUV 4x4" className="max-w-56 max-h-full object-contain relative z-10 hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="pt-8 pb-6 px-4">
                <h3 className="font-bold text-xl mb-4">SUV 4X4</h3>
                <p className="text-gray-600 text-base mb-6">
                  Découvrez nos formules de nettoyage adaptées à votre SUV 4x4.
                </p>
                <AnimatedButton />
              </div>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Choisissez parmi nos nombreux services de nettoyage automobile, 
              en centre ou sur rendez-vous
            </p>
            <Link to="/tarifs" className="relative inline-block">
              <button className="bg-gradient-to-r from-transparent font-bold via-[#FF0000] to-transparent hover:from-transparent hover:via-[#FF4500] hover:to-transparent text-white px-8 py-3 rounded-xl transition-colors relative z-10 border border-4 border-[#FF0000]/30">
                Découvrir nos tarifs
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000] to-[#FF4500] rounded-full blur-md opacity-40 transform scale-y-[-1] translate-y-8"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-50 bg-black text-white relative overflow-hidden w-full">
        {/* Cercles d'ambiance pour la section Testimonials */}
        <div className="light-circle circle1" style={{zIndex: 1}}></div>
        <div className="light-circle circle3" style={{zIndex: 1}}></div>
        <div className="light-circle circle5" style={{zIndex: 1}}></div>
        
        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="text-center mb-16 w-full">
            <h2  data-aos="fade-up"
     data-aos-duration="2000"    className="text-5xl font-bold text-white mb-6">
              NOS SERVICES PROFESSIONNELS
            </h2>
            <p data-aos="fade-up"
     data-aos-duration="3000" className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez l'excellence de nos services de nettoyage automobile avec des équipements modernes et des produits de qualité premium
            </p>
          </div>
          {/* Bento Grid - Design Minimal Élégant */}
          <div className="grid grid-cols-5 gap-6 max-w-6xl mx-auto">
            
            {/* Service Principal - Grande carte avec vidéo dominante */}
            <div className="col-span-5 md:col-span-3 h-80 bg-black rounded-3xl overflow-hidden relative group">
              <OptimizedVideo
                src={cercle1Video}
                autoPlay 
                loop 
                muted 
                playsInline
                controls={false}
                preload="metadata"
                webkit-playsinline="true"
                x5-playsinline="true"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-medium">01</span>
                  </div>
                  <i className='bx bx-car text-white text-3xl'></i>
                </div>
                <div className="text-white">
                  <h3 className="text-3xl font-bold mb-3">Nettoyage Intérieur  </h3>
                  <p className="text-gray-200 mb-4 leading-relaxed">
                   
                    Service professionnel de nettoyage intérieur avec aspiration, nettoyage des sièges et désinfection complète.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <i className='bx bx-time text-[#FF0000]'></i>
                      <span className="text-sm">45 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className='bx bx-star text-[#FF0000]'></i>
                      <span className="text-sm">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Info Rapide */}
            <div className="col-span-5 md:col-span-2 h-80 space-y-6">
              
              {/* Stats */}
              <div data-aos="flip-up"  data-aos-duration="3000"  className="h-36 bg-gradient-to-br from-[#FF0000] to-[#FF4500] rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-black mb-2">100%</div>
                  <div className="text-sm font-medium opacity-90">Satisfaction garantie</div>
                </div>
              </div>

                             {/* Service Intérieur */}
               <div className="h-40 bg-white rounded-3xl overflow-hidden shadow-lg  relative">
                 <div className="absolute inset-0">
                   <OptimizedVideo
                     src={cercle4Video}
                     autoPlay 
                     loop 
                     muted 
                     playsInline
                     controls={false}
                     preload="metadata"
                     webkit-playsinline="true"
                     x5-playsinline="true"
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-black/40"></div>
                 </div>
                 <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                   <div className="flex items-start justify-between">
                     <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                       <span className="text-white text-sm font-medium">02</span>
                     </div>
                     <i className='bx bx-home text-white text-2xl'></i>
                   </div>
                   <div className="text-white">
                     <h4 className="font-bold text-lg mb-2">Lavage Extérieur Premium   </h4>
                     <p className="text-gray-200 text-xs leading-relaxed">
                     Découvrez notre service de lavage extérieur complet avec produits premium et finition impeccable pour votre véhicule.
                     
                     </p>
                   </div>
                 </div>
               </div>

            </div>

            {/* Ligne du bas - Services additionnels */}
            <div className="col-span-5 grid grid-cols-1 md:grid-cols-4 gap-6">
              
                             {/* Service Complet */}
               <div data-aos="flip-up"  data-aos-duration="3000"  className="md:col-span-2 h-48 bg-black rounded-3xl overflow-hidden relative">
                 <div className="absolute inset-0">
                   <OptimizedVideo
                     src={cercle3Video}
                     autoPlay 
                     loop 
                     muted 
                     playsInline
                     controls={false}
                     preload="metadata"
                     webkit-playsinline="true"
                     x5-playsinline="true"
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-black/50"></div>
                 </div>
                 <div   className="relative z-10 p-6 h-full flex flex-col justify-between">
                   <div     className="flex items-start justify-between">
                     <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                       <span className="text-white text-sm font-medium">03</span>
                     </div>
                     <i className='bx bx-shield text-white text-2xl'></i>
                   </div>
                   <div className="text-white">
                     <div className="flex items-center gap-2 mb-3">
                       <h4 className="font-bold text-xl">Formule Complète</h4>
                       <span className="bg-[#FF0000] text-white text-xs px-2 py-1 rounded-full">POPULAIRE</span>
                     </div>
                     <p className="text-gray-200 text-sm leading-relaxed">
                       Service professionnel de polissage et rénovation carrosserie avec équipements spécialisés pour une finition parfaite.
                     </p>
                   </div>
                 </div>
               </div>

              {/* Caractéristiques */}
              <div className="h-48 bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h4 className="font-bold text-lg text-gray-800 mb-4">Nos Atouts</h4>
                                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FF0000]/20 rounded-lg flex items-center justify-center">
                        <i className='bx bx-droplet text-[#FF0000] text-sm'></i>
                      </div>
                      <span className="text-sm text-gray-600">Produits premium</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FF0000]/20 rounded-lg flex items-center justify-center">
                        <i className='bx bx-cog text-[#FF0000] text-sm'></i>
                      </div>
                      <span className="text-sm text-gray-600">Équipement moderne</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FF0000]/20 rounded-lg flex items-center justify-center">
                        <i className='bx bx-shield-check text-[#FF0000] text-sm'></i>
                      </div>
                      <span className="text-sm text-gray-600">Garantie qualité</span>
                    </div>
                  </div>
              </div>

              {/* Temps de service */}
              <div className="h-48 bg-black rounded-3xl p-6 text-white flex flex-col justify-center items-center text-center">
                <i className='bx bx-time-five text-[#FF0000] text-4xl mb-4'></i>
                <div className="text-3xl font-bold mb-2">30-60</div>
                <div className="text-sm opacity-70">MINUTES</div>
                <div className="mt-3 text-xs opacity-50">Temps moyen</div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gradient-to-br from-[#FF0000] to-[#FF4500] relative overflow-hidden">
        {/* Cercles d'ambiance pour la section FAQ */}
        <div className="light-circle circle1" style={{zIndex: 1, opacity: 0.1}}></div>
        <div className="light-circle circle5" style={{zIndex: 1, opacity: 0.1}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* En-tête de la section */}
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <span className="text-white/80 text-base mb-2 block">Questions & Réponses</span>
            <h2 className="text-3xl font-bold text-white mb-4">
              Vos Questions Fréquentes
            </h2>
            <div className="w-20 h-1 bg-white mx-auto mb-4"></div>
            <p className="text-white/90 text-base">
              Retrouvez ici les réponses aux questions les plus fréquentes concernant nos services.
            </p>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <i className='bx bx-time text-white text-2xl mb-2'></i>
              <div className="text-white text-xl font-bold mb-1">9h30-12h30 / 13h30-18h30</div>
              <p className="text-white/80 text-sm">Horaires d'ouverture</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <i className='bx bx-check-shield text-white text-2xl mb-2'></i>
              <div className="text-white text-xl font-bold mb-1">100%</div>
              <p className="text-white/80 text-sm">Satisfaction client</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <i className='bx bx-car text-white text-2xl mb-2'></i>
              <div className="text-white text-xl font-bold mb-1">4+</div>
              <p className="text-white/80 text-sm">Services spécialisés</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <i className='bx bx-medal text-white text-2xl mb-2'></i>
              <div className="text-white text-xl font-bold mb-1">10+ ans</div>
              <p className="text-white/80 text-sm">D'expérience</p>
            </div>
          </div>

          {/* Accordéon FAQ */}
          <div className="max-w-2xl mx-auto mb-8">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="mb-3 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-[#FF0000] to-[#FF4500] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="w-8 h-8 bg-[#FF0000]/10 rounded-full flex items-center justify-center">
                        <i className={`bx ${faq.icon} text-[#FF0000] text-xl`}></i>
                      </div>
                    </div>
                    {faq.question}
                  </h3>
                  <i className={`bx ${openFaq === index ? 'bx-minus' : 'bx-plus'} text-[#FF0000] text-xl transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}></i>
                </button>
                <div 
                  className={`px-4 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-72 pb-4' : 'max-h-0'}`}
                >
                  <div className="text-gray-700 text-sm">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section contact rapide */}
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-3">
              Vous ne trouvez pas la réponse à votre question ?
            </h3>
            <p className="text-white/90 mb-6 text-base">
              Notre équipe est là pour vous aider.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:0650304417" className="bg-white text-[#FF0000] px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2 text-sm">
                <i className='bx bx-phone'></i>
                06 50 30 44 17
              </a>
              <a href="mailto:lesasdelauto06@gmail.com" className="bg-white/20 text-white px-6 py-2 rounded-full font-semibold hover:bg-white/30 transition-colors flex items-center gap-2 text-sm">
                <i className='bx bx-envelope'></i>
                Nous contacter par email
              </a>
            </div>
          </div>
        </div>
      </section>

      
      {/* Video Section - Bento Design */}
      <section className="py-20 bg-white relative overflow-hidden w-full">
        {/* Cercles d'ambiance pour la section Video */}
        <div className="light-circle circle3" style={{zIndex: 1, opacity: 0.4}}></div>
        <div className="light-circle circle6" style={{zIndex: 1, opacity: 0.6}}></div>
        
        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="text-center mb-16 w-full">
            <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Découvrez Les AS de L'Auto
            </h2>
            <p data-aos="fade-up" data-aos-delay="200" className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une équipe passionnée au service de votre véhicule
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            
            {/* Vidéo principale - Grande carte */}
            <div data-aos="fade-right" className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
                    <i className='bx bx-play text-white text-2xl'></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Notre Histoire</h3>
                    <p className="text-gray-500">Découvrez notre passion</p>
                  </div>
                </div>
                <div className="mb-6 relative aspect-[1/2] md:aspect-[1/1]">
                  <iframe 
                    src="https://player.vimeo.com/video/1095975353?h=079cc792f9&badge=0&autopause=0&player_id=0&app_id=58479" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                    className="absolute inset-0 w-full h-full rounded-2xl" 
                    title="les AS De L'Auto"
                  ></iframe>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Depuis notre création, Les AS de L'Auto s'est imposé comme une référence dans le nettoyage automobile professionnel. 
                  Notre équipe expérimentée utilise les dernières technologies et produits premium pour redonner éclat et propreté à votre véhicule.
                </p>
              </div>
            </div>

            {/* Colonne droite - Informations */}
            <div className="space-y-6">
              
              {/* Notre Mission */}
              <div data-aos="fade-left" data-aos-delay="100" className="bg-gradient-to-br from-[#FF0000] to-[#FF4500] rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <i className='bx bx-target-lock text-3xl'></i>
                  <h4 className="text-xl font-bold">Notre Mission</h4>
                </div>
                <p className="leading-relaxed">
                  Offrir un service de nettoyage automobile d'exception, alliant expertise technique et respect de l'environnement pour la satisfaction totale de nos clients.
                </p>
              </div>

              {/* Nos Valeurs */}
              <div data-aos="fade-left" data-aos-delay="200" className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className='bx bx-heart text-[#FF0000]'></i>
                  Nos Valeurs
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FF0000]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-check text-[#FF0000]'></i>
                    </div>
                    <span className="text-gray-700">Excellence du service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FF0000]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-leaf text-[#FF0000]'></i>
                    </div>
                    <span className="text-gray-700">Respect environnemental</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FF0000]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-smile text-[#FF0000]'></i>
                    </div>
                    <span className="text-gray-700">Satisfaction client</span>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div data-aos="fade-left" data-aos-delay="300" className="bg-black rounded-3xl p-6 text-white">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <i className='bx bx-bar-chart text-[#FF0000]'></i>
                  En Chiffres
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF0000]">10+</div>
                    <div className="text-sm opacity-80">Années d'expérience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF0000]">5000+</div>
                    <div className="text-sm opacity-80">Véhicules traités</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF0000]">98%</div>
                    <div className="text-sm opacity-80">Clients satisfaits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF0000]">24h</div>
                    <div className="text-sm opacity-80">Service disponible</div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Section bas avec engagement */}
      <div data-aos="fade-up" data-aos-delay="400" className="mt-16 bg-gradient-to-r from-[#FF0000] to-[#FF4500]  p-8 text-center">
        <h4 className="text-2xl font-bold text-white mb-4">Notre Engagement Qualité</h4>
        <p className="text-white/90 text-lg max-w-4xl mx-auto mb-6">
          Chez Les AS de L'Auto, chaque véhicule est traité avec le même soin et la même attention aux détails. 
          Nous nous engageons à utiliser uniquement des produits écologiques et des techniques respectueuses de votre véhicule et de l'environnement.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-white transition-colors">
            <i className='bx bx-shield text-[#FF0000]'></i>
            <span className="font-semibold text-gray-800">Garantie Satisfait ou Remboursé</span>
          </div>
          <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-white transition-colors">
            <i className='bx bx-recycle text-green-600'></i>
            <span className="font-semibold text-gray-800">Produits Écologiques</span>
          </div>
          <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-white transition-colors">
            <i className='bx bx-time text-blue-600'></i>
            <span className="font-semibold text-gray-800">Service Rapide</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
