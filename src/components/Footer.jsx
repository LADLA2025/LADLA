import React from 'react';
import { Link } from 'react-router-dom';
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
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm opacity-60">
          {/* Liens légaux - responsive */}
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2 mb-6 md:mb-4">
            <Link to="/mentions-legales" className="hover:text-[#FFA600] transition-colors">
              Mentions légales
            </Link>
            <Link to="/cgv-politique" className="hover:text-[#FFA600] transition-colors">
              CGV - Politique de confidentialité
            </Link>
            <button 
              onClick={() => {
                // Supprimer le consentement pour faire réapparaître la bannière
                localStorage.removeItem('cookie-consent');
                // Recharger la page pour réinitialiser le composant
                window.location.reload();
              }}
              className="text-left hover:text-[#FFA600] transition-colors focus:outline-none focus:text-[#FFA600]"
            >
              Gérer les cookies
            </button>
            <Link to="/contact" className="hover:text-[#FFA600] transition-colors">
              Contact
            </Link>
            <Link to="/services" className="hover:text-[#FFA600] transition-colors">
              Nos services
            </Link>
          </div>
          
          {/* Crédit développeur */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-4">
            <div className="mb-3 md:mb-0">
              <p className="text-sm md:text-base opacity-90 font-medium">
                © 2024 LES AS DE L'AUTO
              </p>
            </div>
            <div className="text-sm md:text-base opacity-80">
              <p>
                Application créée par{' '}
                <a 
                  href="https://rebu1ld.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#FFA600] hover:text-[#FF9500] transition-colors font-semibold"
                >
                  @rebu1ld.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 