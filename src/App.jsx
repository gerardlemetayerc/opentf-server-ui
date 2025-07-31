import GestionInstanceDetail from './GestionInstanceDetail';
import GestionInstances from './GestionInstances';
import GestionTachesPlanifiees from './GestionTachesPlanifiees';
import GestionWorkers from './GestionWorkers';
import Configuration from './Configuration';
import EditUtilisateur from './EditUtilisateur';



import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import DashboardPanels from './DashboardPanels';
import './App.css';
import '@xyflow/react/dist/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import GestionOffres from './GestionOffres';
import NouvelleInstance from './NouvelleInstance';
import GestionIAM from './GestionIAM';
import AuthConfig from './AuthConfig';
import GestionGroupes from './GestionGroupes';
import GestionRoles from './GestionRoles';
import EditGroupe from './EditGroupe';
import GestionUtilisateurs from './GestionUtilisateurs';
import GestionDomainesPage from './GestionDomainesPage';
import EditOffrePage from './EditOffrePage';
import DemandeInstancePage from './DemandeInstancePage';
import { LoginPage, UserProvider } from "./Auth";
import RequireAuth from "./RequireAuth";
import RepositoryPage from './RepositoryPage';


function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-wrapper layout-fixed sidebar-expand-lg sidebar-open bg-body-tertiary">
          <Navbar />
          <Sidebar />
          <main className="app-main">
            <div className="container-fluid">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                {/* Toutes les autres routes protégées */}
                <Route path="*" element={
                  <RequireAuth>
                    <Routes>
                      <Route path="/instance/:id" element={<GestionInstanceDetail />} />
                      <Route path="/instances" element={<GestionInstances />} />
                      <Route path="/" element={
                        <div>
                          {/* Dashboard panels */}
                          <div className="container-fluid mt-4">
                            <DashboardPanels />
                          </div>
                        </div>
                      } />
                      <Route path="/offres" element={<GestionOffres />} />
                      <Route path="/servicecatalog" element={<NouvelleInstance />} />
                      <Route path="/iam" element={<GestionIAM />} />
                      <Route path="/iam/auth" element={<AuthConfig />} />
                      <Route path="/iam/groups" element={<GestionGroupes />} />
                      <Route path="/iam/groups/:id" element={<EditGroupe />} />
                      <Route path="/iam/roles" element={<GestionRoles />} />
                      <Route path="/iam/users" element={<GestionUtilisateurs />} />
                      <Route path="/iam/users/:id" element={<EditUtilisateur />} />
                      <Route path="/configuration" element={<Configuration />} />
                      <Route path="/configuration/workers" element={<GestionWorkers />} />
                      <Route path="/configuration/tasks" element={<GestionTachesPlanifiees />} />
                      <Route path="/configuration/workers" element={<GestionWorkers />} />
                      <Route path="/domaines-admin" element={<GestionDomainesPage />} />
                      <Route path="/offres/:id/edit" element={<EditOffrePage />} />
                      <Route path="/demande-instance/:offerId" element={<DemandeInstancePage />} />
                      <Route path="/repository" element={<RepositoryPage />} />
                      {/* Ajoutez ici d'autres routes pour les autres pages */}
                    </Routes>
                  </RequireAuth>
                } />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
