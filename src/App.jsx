import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './App.css'
import "aos/dist/aos.css"; 
import 'boxicons'
import AOS from 'aos';
import mainVideo from './video/0624.mp4';
import cercle1Video from './video/cercle1.mp4';
import cercle2Video from './video/cercle2.mp4';
import cercle3Video from './video/cercle3.mp4';
import petiteCitadineImg from './IMG/petitecitadine.png';
import citadineImg from './IMG/citadine.png';
import berlineImg from './IMG/berline.png';
import suvImg from './IMG/suv 4x4.png';
import AnimatedButton from './components/AnimatedButton';

function App() {
  const [openFaq, setOpenFaq] = useState(null);
  
  useEffect(() => {
    AOS.init();
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
              <i className='bx bx-check text-[#FFA600]'></i>
              Lavage intérieur et extérieur (détailing)
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <i className='bx bx-check text-[#FFA600]'></i>
              Carrosserie
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <i className='bx bx-check text-[#FFA600]'></i>
              Vente et achat de voitures d'occasion
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <i className='bx bx-check text-[#FFA600]'></i>
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
      answer: "Nous sommes situés au 102 avenue Saint Lambert, 06100 Nice. Nos horaires d'ouverture sont du lundi au samedi, de 9h à 18h."
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
         {/* Vidéo d'arrière-plan */}
         <video 
           className="absolute inset-0 w-full h-full object-cover"
           autoPlay 
           loop 
           muted 
           playsInline
           preload="auto"
           controls={false}
         >
           <source src={mainVideo} type="video/mp4" />
           Votre navigateur ne supporte pas la vidéo HTML5.
         </video>
         
         {/* Cercles d'ambiance animés - AVANT l'overlay */}
         <div className="light-circle circle1" style={{zIndex: 5}}></div>
         <div className="light-circle circle2" style={{zIndex: 5}}></div>
         <div className="light-circle circle3" style={{zIndex: 5}}></div>
         <div className="light-circle circle4" style={{zIndex: 5}}></div>
         <div className="light-circle circle5" style={{zIndex: 5}}></div>
         <div className="light-circle circle6" style={{zIndex: 5}}></div>
         
         {/* Overlay sombre pour la lisibilité */}
         <div className="absolute inset-0 bg-black/40" style={{zIndex: 6}}></div>
         
         <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-[1000px] mx-auto text-left md:text-center">
             <h1 className="text-2xl md:text-6xl font-bold mb-6">
             VOTRE PARTENAIRE AUTOMOBILE DE CONFIANCE
             </h1>
             <p className="text-sm md:text-xl mb-8 opacity-90">
               Notre équipe assure l'entretien complet et professionnel 
               de votre véhicule avec des outils performants dans un centre 
               équipé et moderne
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-start md:justify-center items-start md:items-center">
               <button className="bg-[#FFA600] hover:bg-[#E6950E] text-white px-8 py-3 rounded-full transition-colors flex items-center gap-3">
                 <i className='bx bxl-whatsapp text-3xl'></i>
                 Nos services
               </button>
               <div className="flex items-center gap-">
                 <a href="#" className=" p-3 rounded-full hover:bg-white/30 transition-colors">
                   <i className='bx bxl-instagram text-3xl'></i>
                 </a>
                 <a href="#" className=" p-3 rounded-full hover:bg-white/30 transition-colors">
                   <i className='bx bxl-facebook text-4xl'></i>
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
              <div className="h-60 bg-gradient-to-b from-[#F3F3F3] to-[#FFA600] flex items-center justify-center p-3 relative">
                <div className="absolute inset-0 flex items-start justify-center pt-6">
                  <span data-aos="fade-up" data-aos-duration="2000" className="text-white text-4xl font-bold opacity-40">PETITE CITADINE</span>
                </div>
                <img src={petiteCitadineImg} alt="Petite Citadine" className="max-w-40 max-h-full object-contain relative z-10 hover:scale-105 transition-transform duration-300" />
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
              <div className="h-60 bg-gradient-to-b from-[#F3F3F3] to-[#FFA600] flex items-center justify-center p-3 relative">
                <div className="absolute inset-0 flex items-start justify-center pt-6">
                  <span data-aos="fade-up" data-aos-duration="2000" className="text-white text-4xl font-bold opacity-40">CITADINE</span>
                </div>
                <img src={citadineImg} alt="Citadine" className="max-w-48 max-h-full object-contain relative z-10 hover:scale-105 transition-transform duration-300" />
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
              <div className="h-60 bg-gradient-to-b from-[#F3F3F3] to-[#FFA600] flex items-center justify-center p-3 relative">
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
              <div className="h-60 bg-gradient-to-b from-[#F3F3F3] to-[#FFA600] flex items-center justify-center p-3 relative">
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
              Choisir parmi des dizaines Nettoyage prix en centre, sur 
              rendez-vous
            </p>
            <Link to="/voitures" className="relative inline-block">
              <button className="bg-gradient-to-r from-transparent font-bold via-[#FFA600] to-transparent hover:from-transparent hover:via-[#E6950E] hover:to-transparent text-white px-8 py-3 rounded-xl transition-colors relative z-10 border border-4 border-[#FFA600]/30">
                Découvrir plus
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFA600] to-[#E6950E] rounded-full blur-md opacity-40 transform scale-y-[-1] translate-y-8"></div>
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
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                controls={false}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
                <source src={cercle1Video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-medium">01</span>
                  </div>
                  <i className='bx bx-car text-white text-3xl'></i>
                </div>
                <div className="text-white">
                  <h3 className="text-3xl font-bold mb-3">Lavage Extérieur Premium</h3>
                  <p className="text-gray-200 mb-4 leading-relaxed">
                    Découvrez notre service de lavage extérieur complet avec produits premium et finition impeccable pour votre véhicule.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <i className='bx bx-time text-[#FFA600]'></i>
                      <span className="text-sm">45 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className='bx bx-star text-[#FFA600]'></i>
                      <span className="text-sm">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Info Rapide */}
            <div className="col-span-5 md:col-span-2 h-80 space-y-6">
              
              {/* Stats */}
              <div data-aos="flip-up"  data-aos-duration="3000"  className="h-36 bg-gradient-to-br from-[#FFA600] to-orange-600 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-black mb-2">100%</div>
                  <div className="text-sm font-medium opacity-90">Satisfaction garantie</div>
                </div>
              </div>

                             {/* Service Intérieur */}
               <div className="h-40 bg-white rounded-3xl overflow-hidden shadow-lg  relative">
                 <div className="absolute inset-0">
                   <video 
                     autoPlay 
                     loop 
                     muted 
                     playsInline
                     controls={false}
                     className="w-full h-full object-cover"
                   >
                     <source src={cercle2Video} type="video/mp4" />
                   </video>
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
                     <h4 className="font-bold text-lg mb-2">Nettoyage Intérieur</h4>
                     <p className="text-gray-200 text-xs leading-relaxed">
                       Service professionnel de nettoyage intérieur avec aspiration, nettoyage des sièges et désinfection complète.
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
                   <video 
                     autoPlay 
                     loop 
                     muted 
                     playsInline
                     controls={false}
                     className="w-full h-full object-cover"
                   >
                     <source src={cercle3Video} type="video/mp4" />
                   </video>
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
                       <span className="bg-[#FFA600] text-white text-xs px-2 py-1 rounded-full">POPULAIRE</span>
                     </div>
                     <p className="text-gray-200 text-sm leading-relaxed">
                       Formule premium combinant lavage extérieur, nettoyage intérieur et protection longue durée.
                     </p>
                   </div>
                 </div>
               </div>

              {/* Caractéristiques */}
              <div className="h-48 bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h4 className="font-bold text-lg text-gray-800 mb-4">Nos Atouts</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFA600]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-droplet text-[#FFA600] text-sm'></i>
                    </div>
                    <span className="text-sm text-gray-600">Produits premium</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFA600]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-cog text-[#FFA600] text-sm'></i>
                    </div>
                    <span className="text-sm text-gray-600">Équipement moderne</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFA600]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-shield-check text-[#FFA600] text-sm'></i>
                    </div>
                    <span className="text-sm text-gray-600">Garantie qualité</span>
                  </div>
                </div>
              </div>

              {/* Temps de service */}
              <div className="h-48 bg-black rounded-3xl p-6 text-white flex flex-col justify-center items-center text-center">
                <i className='bx bx-time-five text-[#FFA600] text-4xl mb-4'></i>
                <div className="text-3xl font-bold mb-2">30-60</div>
                <div className="text-sm opacity-70">MINUTES</div>
                <div className="mt-3 text-xs opacity-50">Temps moyen</div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gradient-to-br from-[#FFA600] to-orange-600 relative overflow-hidden">
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
              <div className="text-white text-xl font-bold mb-1">9h30-18h30</div>
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
                      <span className="w-6 h-6 bg-gradient-to-br from-[#FFA600] to-orange-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="w-8 h-8 bg-[#FFA600]/10 rounded-full flex items-center justify-center">
                        <i className={`bx ${faq.icon} text-[#FFA600] text-xl`}></i>
                      </div>
                    </div>
                    {faq.question}
                  </h3>
                  <i className={`bx ${openFaq === index ? 'bx-minus' : 'bx-plus'} text-[#FFA600] text-xl transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}></i>
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
              <a href="tel:0625138033" className="bg-white text-[#FFA600] px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2 text-sm">
                <i className='bx bx-phone'></i>
                06 25 13 80 33
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
                  <div className="w-12 h-12 bg-[#FFA600] rounded-full flex items-center justify-center">
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
              <div data-aos="fade-left" data-aos-delay="100" className="bg-gradient-to-br from-[#FFA600] to-orange-600 rounded-3xl p-8 text-white">
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
                  <i className='bx bx-heart text-[#FFA600]'></i>
                  Nos Valeurs
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFA600]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-check text-[#FFA600]'></i>
                    </div>
                    <span className="text-gray-700">Excellence du service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFA600]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-leaf text-[#FFA600]'></i>
                    </div>
                    <span className="text-gray-700">Respect environnemental</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFA600]/20 rounded-lg flex items-center justify-center">
                      <i className='bx bx-smile text-[#FFA600]'></i>
                    </div>
                    <span className="text-gray-700">Satisfaction client</span>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div data-aos="fade-left" data-aos-delay="300" className="bg-black rounded-3xl p-6 text-white">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <i className='bx bx-bar-chart text-[#FFA600]'></i>
                  En Chiffres
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FFA600]">10+</div>
                    <div className="text-sm opacity-80">Années d'expérience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FFA600]">5000+</div>
                    <div className="text-sm opacity-80">Véhicules traités</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FFA600]">98%</div>
                    <div className="text-sm opacity-80">Clients satisfaits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FFA600]">24h</div>
                    <div className="text-sm opacity-80">Service disponible</div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
{/* Reviews Section */}
<section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Cercles d'ambiance pour la section Reviews */}
        <div className="light-circle circle2" style={{zIndex: 1, opacity: 0.6}}></div>
        <div className="light-circle circle4" style={{zIndex: 1, opacity: 0.8}}></div>
        <div className="light-circle circle1" style={{zIndex: 1, opacity: 0.5}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Nos avis clients
            </h2>
            <div className="flex justify-center mb-8">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <span className="font-bold">Trustpilot</span>
                <div className="flex text-white">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Review 1 - Grande carte */}
            <div className="md:col-span-2 lg:col-span-1 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFA600] to-orange-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h3 className="text-gray-800 font-bold text-lg">MATTHIEU</h3>
                  <div className="flex text-[#FFA600] text-lg mb-1">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                "Excellent service professionnel ! Mon véhicule n'a jamais été aussi propre. L'équipe est vraiment compétente et le résultat dépasse mes attentes."
              </p>
            </div>

            {/* Review 2 - Carte moyenne */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">V</span>
                </div>
                <div>
                  <h3 className="text-gray-800 font-bold">VALERIE</h3>
                  <div className="flex text-[#FFA600] text-sm">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "Service rapide et de qualité. Je recommande vivement cette station de lavage !"
              </p>
            </div>

            {/* Review 3 - Carte moyenne */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h3 className="text-gray-800 font-bold">MATTHIEU</h3>
                  <div className="flex text-[#FFA600] text-sm">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "Très satisfait du résultat ! Service professionnel et prix raisonnable."
              </p>
            </div>

            {/* Review 4 - Carte large */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h3 className="text-gray-800 font-bold">SOPHIE</h3>
                  <div className="flex text-[#FFA600] text-sm">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg">
                "Un service de qualité exceptionnelle ! L'entretien complet de ma voiture a été parfait. Équipe professionnelle et résultats impeccables."
              </p>
            </div>

            {/* Review 5 - Carte compacte */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">L</span>
                </div>
                <div>
                  <h3 className="text-gray-800 font-bold">LUCAS</h3>
                  <div className="flex text-[#FFA600] text-sm">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "Parfait pour mon SUV ! Service rapide et efficace."
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Section bas avec engagement */}
      <div data-aos="fade-up" data-aos-delay="400" className="mt-16 bg-gray-50 rounded-3xl p-8 text-center">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">Notre Engagement Qualité</h4>
        <p className="text-gray-600 text-lg max-w-4xl mx-auto mb-6">
          Chez Les AS de L'Auto, chaque véhicule est traité avec le même soin et la même attention aux détails. 
          Nous nous engageons à utiliser uniquement des produits écologiques et des techniques respectueuses de votre véhicule et de l'environnement.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-white px-6 py-3 rounded-full shadow-md flex items-center gap-2">
            <i className='bx bx-shield text-[#FFA600]'></i>
            <span className="font-semibold text-gray-700">Garantie Satisfait ou Remboursé</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-full shadow-md flex items-center gap-2">
            <i className='bx bx-recycle text-green-500'></i>
            <span className="font-semibold text-gray-700">Produits Écologiques</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-full shadow-md flex items-center gap-2">
            <i className='bx bx-time text-blue-500'></i>
            <span className="font-semibold text-gray-700">Service Rapide</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
