import React, { useState, useEffect } from 'react';

function AnimatedButton({ children }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecte si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation automatique sur mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  return (
    <button 
      className={`group relative w-full overflow-hidden bg-white border-2 border-[#FF0000] ${isAnimating ? 'text-white' : 'text-[#FF0000]'} py-4 rounded-lg font-bold text-lg transition-all duration-500 hover:text-white hover:shadow-lg ${isAnimating ? 'animate-button' : ''}`}
      onMouseEnter={() => !isMobile && setIsAnimating(true)}
      onMouseLeave={() => !isMobile && setIsAnimating(false)}
    >
      <span className={`absolute inset-0 bg-gradient-to-r from-[#FF0000] to-[#FF4500] transform transition-transform duration-500 ease-out ${isAnimating ? 'translate-x-0' : '-translate-x-full'}`}></span>
      <span className="relative flex items-center justify-center gap-3">
        <i className={`bx bx-calendar text-xl transition-transform duration-300 ${isAnimating ? 'rotate-12' : ''}`}></i>
        <span className={`transition-all duration-300 ${isAnimating ? 'tracking-wider' : ''}`}>RÉSERVER</span>
      </span>
      <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute bottom-2 right-4 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
      </div>
    </button>
  );
}

export default AnimatedButton; 
