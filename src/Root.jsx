import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
// Import des pages principales
import Accueil from "./pages/Accueil";
import Contact from "./pages/Contact";
import Garage from "./pages/Garage";
import Services from "./pages/Services";
import Tarifs from "./pages/Tarifs";
import MentionsLegales from "./pages/MentionsLegales";
import CGVPolitique from "./pages/CGVPolitique";

// Import des pages voitures
import VoituresRoot from "./PAGE_voiture/VoituresRoot";
import Berline from "./PAGE_voiture/Berline";
import Citadine from "./PAGE_voiture/Citadine";
import PetiteCitadine from "./PAGE_voiture/PetiteCitadine";
import SUV from "./PAGE_voiture/SUV";

// Import du panneau d'administration
import PanelAdmin from "./Panneldecommande/PanelAdmin";
import Login from "./Panneldecommande/Login";
import Reservation from "./Panneldecommande/Reservation";
import AdminServices from "./Panneldecommande/Services1";
import AdminPetiteCitadine from "./Panneldecommande/service/PetiteCitadine";
import AdminCitadine from "./Panneldecommande/service/Citadine";
import AdminBerline from "./Panneldecommande/service/Berline";
import AdminSUV from "./Panneldecommande/service/SUV";

// Import du Layout et des composants d'authentification
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function Root() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/cgv-politique" element={<CGVPolitique />} />
            
            {/* Routes des voitures */}
            <Route path="/voitures" element={<VoituresRoot />} />
            <Route path="/voitures/berline" element={<Berline />} />
            <Route path="/voitures/citadine" element={<Citadine />} />
            <Route path="/voitures/petite-citadine" element={<PetiteCitadine />} />
            <Route path="/voitures/suv" element={<SUV />} />
          </Route>

          {/* Routes d'administration (sans le Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <PanelAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <ProtectedRoute>
              <AdminServices />
            </ProtectedRoute>
          } />
          <Route path="/admin/services/petite-citadine" element={
            <ProtectedRoute>
              <AdminPetiteCitadine />
            </ProtectedRoute>
          } />
          <Route path="/admin/services/citadine" element={
            <ProtectedRoute>
              <AdminCitadine />
            </ProtectedRoute>
          } />
          <Route path="/admin/services/berline" element={
            <ProtectedRoute>
              <AdminBerline />
            </ProtectedRoute>
          } />
          <Route path="/admin/services/suv" element={
            <ProtectedRoute>
              <AdminSUV />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default Root;