import React from 'react';
import logo from '../IMG/logo.jpg';

function Footer() {
  return (
    <footer className="bg-black text-white py-22">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {/* Logo dans le footer */}
            <div className="mb-6 flex justify-start">
              <img src={logo} alt="Logo" className="h-24 w-auto rounded-lg" />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-[#FFA600]">Notre histoire</a></li>
              <li><a href="#" className="hover:text-[#FFA600]">Nos équipes</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Nous suivre</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-[#FFA600]">Instagram</a></li>
              <li><a href="#" className="hover:text-[#FFA600]">Facebook</a></li>
              <li><a href="#" className="hover:text-[#FFA600]">Download</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">La newsletter</h3>
            <p className="text-sm opacity-80 mb-4">
              Recevez nos dernières actualités et nos promotions en cours
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Entrez votre mail" 
                className="flex-1 px-4 py-2 bg-white text-black border border-gray-700 rounded-l focus:outline-none focus:border-[#FFA600]"
              />
              <button className="bg-[#FFA600] hover:bg-[#E6950E] px-6 py-2 rounded-r transition-colors">
                S'abonner
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-[#FFA600]">Mentions légales</a>
            <a href="#" className="hover:text-[#FFA600]">CGV - Politique de confidentialité</a>
            <a href="#" className="hover:text-[#FFA600]">Cookies</a>
            <a href="#" className="hover:text-[#FFA600]">Politique confidentialité</a>
            <a href="#" className="hover:text-[#FFA600]">Toutes nos produits</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 