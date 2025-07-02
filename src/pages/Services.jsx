import React from 'react';
import { motion } from 'framer-motion';
import cercle1Video from '../video/cercle5.mp4';
import cercle2Video from '../video/cercle6.mp4';
import cercle3Video from '../video/cercle7.mp4';

function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const mainServices = [
    {
      icon: 'bx-car',
      title: 'Carrosserie',
      description: "Expertise en réparation et rénovation de carrosserie, pour redonner à votre véhicule son aspect d'origine.",
      video: cercle1Video
    },
    {
      icon: 'bx-purchase-tag-alt',
      title: 'Achat & vente',
      description: "Service complet d'accompagnement pour l'achat ou la vente de votre véhicule, avec expertise professionnelle.",
      video: cercle2Video
    },
    {
      icon: 'bx-key',
      title: 'Location',
      description: "Solutions de location flexibles adaptées à vos besoins, avec un parc de véhicules régulièrement renouvelé.",
      video: cercle3Video
    }
  ];

  const services = {
    entretien: {
      icon: 'bx-car-wash',
      title: 'Entretien & Esthétique auto',
      items: [
        { name: 'Location', desc: 'Solutions de location adaptées à tous vos besoins' },
        { name: 'Detailing', desc: 'Soin minutieux et personnalisé pour votre véhicule' },
        { name: 'Carrosserie minute', desc: 'Réparations rapides et professionnelles' },
        { name: 'Lavage rénovation', desc: "Restauration complète de l'aspect de votre véhicule" },
        { name: 'Débosselage minute', desc: 'Correction rapide des impacts et bosses' },
        { name: 'Lavage express', desc: 'Service rapide et efficace pour un résultat impeccable' }
      ]
    },
    technique: {
      icon: 'bx-wrench',
      title: 'Travaux techniques & finitions',
      items: [
        { name: 'Sellerie', desc: 'Rénovation et personnalisation de votre intérieur' },
        { name: 'Ciel étoilé', desc: 'Installation de plafonds lumineux personnalisés' },
        { name: 'Pare-brise', desc: 'Réparation et remplacement professionnel' },
        { name: 'Destickage', desc: "Retrait propre et sans trace de tous types d'adhésifs" },
        { name: 'Vitres teintées', desc: 'Pose de films solaires homologués' }
      ]
    },
    traitement: {
      icon: 'bx-spray-can',
      title: 'Traitements carrosserie',
      items: [
        { name: 'Lustrage carrosserie', desc: "Restauration de la brillance d'origine" },
        { name: 'Polissage carrosserie', desc: 'Élimination des micro-rayures et défauts' },
        { name: 'Traitement déperlant', desc: 'Protection hydrophobe longue durée' },
        { name: 'Traitement céramique', desc: 'Protection premium pour votre carrosserie' }
      ]
    },
    autres: {
      icon: 'bx-package',
      title: 'Autres services',
      items: [
        { name: 'Vente de produits', desc: "Gamme complète de produits d'entretien professionnels" },
        { name: 'Options sur mesures', desc: 'Personnalisation selon vos souhaits' },
        { name: 'Service Carte Grise', desc: 'Accompagnement dans vos démarches administratives' }
      ]
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Cercles d'ambiance */}
      <div className="light-circle circle1"></div>
      <div className="light-circle circle2"></div>
      <div className="light-circle circle3"></div>
      <div className="light-circle circle4"></div>
      <div className="light-circle circle5"></div>
      <div className="light-circle circle6"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h1 
          className="text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFA600] to-orange-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Nos Services
        </motion.h1>
        <motion.p
          className="text-center text-gray-600 mb-16 text-lg max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Découvrez notre gamme complète de services professionnels pour l'entretien et l'embellissement de votre véhicule
        </motion.p>

        {/* Services principaux avec vidéos */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mainServices.map((service, index) => (
            <motion.div
              key={index}
              className="relative group overflow-hidden rounded-3xl shadow-lg bg-white"
              variants={itemVariants}
            >
              <div className="aspect-video relative overflow-hidden">
                <video 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  controls={false}
                >
                  <source src={service.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <i className={`bx ${service.icon} text-[#FFA600] text-3xl`}></i>
                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                  <p className="text-white/90">{service.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sections de services détaillés */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(services).map(([key, section]) => (
            <motion.div
              key={key}
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow relative overflow-hidden group"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#FFA600]/10 flex items-center justify-center">
                    <i className={`bx ${section.icon} text-[#FFA600] text-2xl`}></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-xl bg-gray-50 hover:bg-[#FFA600]/5 transition-colors"
                      whileHover={{ x: 10 }}
                    >
                      <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Services; 