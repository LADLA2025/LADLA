import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Reservation from './Reservation';
import Services1 from './Services1';

const PanelAdmin = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Tableau de Bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Réservations</h3>
                <p className="text-3xl font-bold text-[#FFA600]">24</p>
                <p className="text-sm text-gray-600">Cette semaine</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Services</h3>
                <p className="text-3xl font-bold text-[#FFA600]">156</p>
                <p className="text-sm text-gray-600">Ce mois</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Revenus</h3>
                <p className="text-3xl font-bold text-[#FFA600]">12.5k€</p>
                <p className="text-sm text-gray-600">Ce mois</p>
              </div>
            </div>
          </div>
        );
      case 'reservations':
        return <Reservation />;
      case 'services':
        return <Services1 />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
            {/* Contenu des paramètres */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Bouton Menu Hamburger - visible seulement sur mobile */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
      >
        <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl text-[#FFA600]`}></i>
      </button>

      <div className="flex relative">
        {/* Sidebar */}
        <aside className={`fixed md:relative w-64 bg-white shadow-lg h-screen z-40 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <i className='bx bx-x text-2xl'></i>
              </button>
            </div>
            <nav className="space-y-2">
              <button 
                onClick={() => {
                  setSelectedSection('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  selectedSection === 'dashboard' ? 'bg-[#FFA600] text-white' : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <i className='bx bx-home-alt text-xl'></i>
                Dashboard
              </button>
              
              <button 
                onClick={() => {
                  setSelectedSection('reservations');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  selectedSection === 'reservations' ? 'bg-[#FFA600] text-white' : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <i className='bx bx-calendar text-xl'></i>
                Réservations
              </button>
              
              <button 
                onClick={() => {
                  setSelectedSection('services');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  selectedSection === 'services' ? 'bg-[#FFA600] text-white' : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <i className='bx bx-car text-xl'></i>
                Services
              </button>

              <button 
                onClick={() => {
                  setSelectedSection('settings');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  selectedSection === 'settings' ? 'bg-[#FFA600] text-white' : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                <i className='bx bx-cog text-xl'></i>
                Paramètres
              </button>

              <button 
                onClick={handleLogout}
                className="w-full px-6 py-3 flex items-center gap-3 rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50 mt-4"
              >
                <i className='bx bx-log-out text-xl'></i>
                Déconnexion
              </button>
            </nav>
          </div>
        </aside>

        {/* Overlay sombre pour mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 relative z-20">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PanelAdmin; 