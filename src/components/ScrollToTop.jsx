import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Faire défiler vers le haut à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Défilement fluide
    });
  }, [pathname]);

  return null; // Ce composant ne rend rien
}

export default ScrollToTop; 