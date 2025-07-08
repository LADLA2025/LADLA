import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { to: "/", icon: "bx-home", text: "ACCUEIL" },
    { to: "/services", icon: "bx-cog", text: "NOS SERVICES" },
    { to: "/tarifs", icon: "bx-euro", text: "NOS TARIFS" },
    { to: "/garage", icon: "bx-wrench", text: "NOTRE GARAGE" },
    { to: "/contact", icon: "bx-phone", text: "CONTACT" }
  ];

  return (
    <header className="bg-black p-6 fixed top-0 left-0 right-0 z-50 text-white">
      <nav className="container mx-auto px-2 py-2 flex items-center relative">
       
        {/* Navigation desktop parfaitement centrée */}
        <ul className="hidden lg:flex space-x-26 text-sm font-medium mx-auto">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link 
                to={item.to} 
                className="hover:text-[#FF0000] transition-colors flex items-center gap-2"
              >
                <i className={`bx ${item.icon} text-[#FF0000] text-lg`}></i>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Menu mobile à droite */}
        <button 
          className="lg:hidden absolute right-2 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <motion.div
            animate={isMenuOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 }
            }}
          >
            {isMenuOpen ? (
              <i className='bx bx-x text-2xl text-[#FF0000]'></i>
            ) : (
              <i className='bx bx-menu text-2xl'></i>
            )}
          </motion.div>
        </button>

        {/* Menu mobile overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-40"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.ul
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="absolute right-0 top-0 bottom-0 w-64 bg-black pt-20 px-4 space-y-4"
                onClick={e => e.stopPropagation()}
              >
                {menuItems.map((item) => (
                  <motion.li
                    key={item.to}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to={item.to} 
                      className="flex items-center gap-3 text-base font-medium hover:text-[#FF0000] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className={`bx ${item.icon} text-[#FF0000] text-xl`}></i>
                      {item.text}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Header; 
