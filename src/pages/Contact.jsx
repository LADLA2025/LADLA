import React from 'react';
import { motion } from 'framer-motion';
import img1065 from './imgg/IMG_1065.jpeg';
import img1067 from './imgg/IMG_1067.jpeg';
import img2428 from './imgg/IMG_2428.jpeg';

function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const selectedImages = [
    img1065,  // Vue de l'atelier
    img1067,  // Vue des équipements
    img2428   // Vue extérieure
  ];

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
          Contactez-nous
        </motion.h1>
        <motion.p
          className="text-center text-gray-600 mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Nous sommes là pour vous aider
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] md:auto-rows-[180px] gap-4 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Carte de formulaire - span 2 colonnes et 2 rangées */}
          <motion.div 
            className="col-span-1 md:col-span-2 row-span-2 bg-white rounded-3xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow relative overflow-hidden group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Envoyez-nous un message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#FFA600] focus:outline-none transition-colors resize-none"
                    placeholder="Votre message..."
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#FFA600] to-orange-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  <i className="bx bx-send"></i>
                  Envoyer
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Images de l'établissement */}
          {selectedImages.map((image, index) => (
            <motion.div 
              key={index}
              className="col-span-1 bg-white rounded-3xl shadow-lg overflow-hidden relative group h-[250px] md:h-auto"
              variants={itemVariants}
            >
              <img
                src={image}
                alt={`Notre établissement ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}

          {/* Carte d'horaires */}
          <motion.div 
            className="col-span-1 md:col-span-2 bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FFA600]/10 flex items-center justify-center">
                  <i className="bx bx-time text-[#FFA600] text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-800">Nos horaires</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl bg-gray-50">
                  <p className="font-medium text-gray-800">Lun - Ven</p>
                  <p className="text-gray-600">8h00 - 19h00</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50">
                  <p className="font-medium text-gray-800">Samedi</p>
                  <p className="text-gray-600">9h00 - 18h00</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50">
                  <p className="font-medium text-gray-800">Dimanche</p>
                  <p className="text-gray-600">9h00 - 13h00</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Carte email */}
          <motion.div 
            className="col-span-1 bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FFA600]/10 flex items-center justify-center">
                  <i className="bx bx-envelope text-[#FFA600] text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-800">Email</h3>
              </div>
              <p className="text-gray-600">contact@lesasdelauto.fr</p>
            </div>
          </motion.div>

          {/* Carte de téléphone */}
          <motion.div 
            className="col-span-1 bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FFA600]/10 flex items-center justify-center">
                  <i className="bx bx-phone text-[#FFA600] text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-800">Téléphone</h3>
              </div>
              <p className="text-gray-600">06 25 13 80 33</p>
              <p className="text-gray-600">06 50 30 44 17</p>
            </div>
          </motion.div>

          {/* Carte d'adresse */}
          <motion.div 
            className="col-span-1 bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FFA600]/10 flex items-center justify-center">
                  <i className="bx bx-map text-[#FFA600] text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-800">Notre adresse</h3>
              </div>
              <p className="text-gray-600">102 avenue saint Lambert, Nice, France</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact; 