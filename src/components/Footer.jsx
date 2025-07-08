import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildAPIUrl, API_ENDPOINTS } from '../config/api.js';
import logo from '../IMG/logo.jpg';

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  // Gérer l'inscription à la newsletter
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail) {
      setSubscribeMessage('Veuillez entrer votre email');
      return;
    }

    try {
      setIsSubscribing(true);
      setSubscribeMessage('');

      const response = await fetch(buildAPIUrl(API_ENDPOINTS.NEWSLETTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          source: 'website'
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubscribeMessage('Merci ! Vous êtes maintenant abonné à notre newsletter.');
        setNewsletterEmail('');
      } else {
        setSubscribeMessage('Erreur : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setSubscribeMessage('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsSubscribing(false);
    }
  };

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
              <li><a href="#" className="hover:text-[#FF0000]">Notre histoire</a></li>
              <li><a href="#" className="hover:text-[#FF0000]">Nos équipes</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Nous suivre</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-[#FF0000]">Instagram</a></li>
              <li><a href="#" className="hover:text-[#FF0000]">Facebook</a></li>
              <li><a href="#" className="hover:text-[#FF0000]">Download</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">La newsletter</h3>
            <p className="text-sm opacity-80 mb-4">
              Recevez nos dernières actualités et nos promotions en cours
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Entrez votre mail" 
                  className="flex-1 px-4 py-2 bg-white text-black border border-gray-700 rounded-l focus:outline-none focus:border-[#FF0000]"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-[#FF0000] hover:bg-[#CC0000] px-6 py-2 rounded-r transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubscribing ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    'S\'abonner'
                  )}
                </button>
              </div>
              {subscribeMessage && (
                <div className={`text-xs p-2 rounded ${
                  subscribeMessage.includes('Merci') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscribeMessage}
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm opacity-60">
          {/* Liens légaux - responsive */}
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2 mb-6 md:mb-4">
            <Link to="/mentions-legales" className="hover:text-[#FF0000] transition-colors">
              Mentions légales
            </Link>
            <Link to="/cgv-politique" className="hover:text-[#FF0000] transition-colors">
              CGV - Politique de confidentialité
            </Link>
            <button 
              onClick={() => {
                // Supprimer le consentement pour faire réapparaître la bannière
                localStorage.removeItem('cookie-consent');
                // Recharger la page pour réinitialiser le composant
                window.location.reload();
              }}
              className="text-left hover:text-[#FF0000] transition-colors focus:outline-none focus:text-[#FF0000]"
            >
              Gérer les cookies
            </button>
            <Link to="/contact" className="hover:text-[#FF0000] transition-colors">
              Contact
            </Link>
            <Link to="/services" className="hover:text-[#FF0000] transition-colors">
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
                  className="text-[#FF0000] hover:text-[#CC0000] transition-colors font-semibold"
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
