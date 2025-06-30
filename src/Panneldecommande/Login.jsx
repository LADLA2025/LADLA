import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Tentative de connexion...');
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password }),
      });

      console.log('Statut de la réponse:', response.status);

      let data;
      try {
        data = await response.json();
        console.log('Données reçues:', data);
      } catch (jsonError) {
        console.error('Erreur lors du parsing JSON:', jsonError);
        throw new Error('Erreur lors de la lecture de la réponse');
      }

      if (response.ok && data.success) {
        console.log('Connexion réussie, redirection...');
        login(); // Active l'état authentifié
        navigate('/admin');
      } else {
        console.log('Erreur de connexion:', data.error);
        setError(data.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      setError('Erreur de connexion au serveur. Vérifiez que le serveur est bien démarré.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      {/* Cercles d'ambiance */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFA600]/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-600/20 rounded-full filter blur-3xl"></div>
      </div>

      {/* Container principal */}
      <div className="max-w-4xl w-full relative">
        {/* Grid Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section de gauche - Formulaire */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Connexion Admin</h2>
              <p className="text-gray-400">Accédez à votre espace administrateur</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className='bx bx-lock-alt text-[#FFA600] text-xl'></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-gray-600 rounded-xl text-white focus:border-[#FFA600] focus:ring-1 focus:ring-[#FFA600] transition-colors"
                  placeholder="Entrez votre mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} text-gray-400 hover:text-[#FFA600] text-xl`}></i>
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-100/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FFA600] to-orange-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-[#FFA600] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <i className='bx bx-loader-alt animate-spin text-xl'></i>
                ) : (
                  <i className='bx bx-log-in text-xl'></i>
                )}
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>

          {/* Section de droite - Informations */}
          <div className="space-y-6">
            {/* Carte supérieure */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#FFA600]/20 rounded-full flex items-center justify-center">
                  <i className='bx bx-shield text-[#FFA600] text-2xl'></i>
                </div>
                <div>
                  <h3 className="text-white font-bold">Espace Sécurisé</h3>
                  <p className="text-gray-400 text-sm">Accès réservé aux administrateurs</p>
                </div>
              </div>
            </div>

            {/* Carte du milieu */}
            <div className="bg-gradient-to-br from-[#FFA600] to-orange-600 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <i className='bx bx-calendar text-white text-2xl'></i>
                </div>
                <div>
                  <h3 className="text-white font-bold">Gestion des Réservations</h3>
                  <p className="text-white/80 text-sm">Gérez vos rendez-vous facilement</p>
                </div>
              </div>
            </div>

            {/* Carte inférieure */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFA600]/20 rounded-full flex items-center justify-center">
                  <i className='bx bx-support text-[#FFA600] text-2xl'></i>
                </div>
                <div>
                  <h3 className="text-white font-bold">Besoin d'aide ?</h3>
                  <p className="text-gray-400 text-sm">Contactez le support technique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 