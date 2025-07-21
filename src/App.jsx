import EditUtilisateur from './EditUtilisateur';
              <Route path="/iam/utilisateurs/:id" element={<EditUtilisateur />} />



import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import GestionOffres from './GestionOffres';
import NouvelleInstance from './NouvelleInstance';
import GestionIAM from './GestionIAM';
import AuthConfig from './AuthConfig';
import GestionGroupes from './GestionGroupes';
import GestionRoles from './GestionRoles';
import EditGroupe from './EditGroupe';
import GestionUtilisateurs from './GestionUtilisateurs';



function App() {
  return (
    <Router>
      <div className="app-wrapper layout-fixed sidebar-expand-lg sidebar-open bg-body-tertiary">
        <Navbar />
        <Sidebar />
        <main className="app-main">
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={
                <div>
                  <div className="app-content-header">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-sm-6"><h3 className="mb-0">Layout</h3></div>
                        <div className="col-sm-6">
                          <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><a href="#">Docs</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Layout</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="app-content">
                    <div className="container-fluid">
                      <div className="callout callout-info mb-4">
                        <h5 className="fw-bold">Tips</h5>
                        <p>
                          The <a href="/starter.html" target="_blank" rel="noopener noreferrer" className="callout-link">starter page</a> is a good place to start building your app if you’d like to start from scratch.
                        </p>
                      </div>
                      <p>The layout consists of five major parts:</p>
                      <ul>
                        <li>Wrapper <code>.app-wrapper</code> . A div that wraps the whole site.</li>
                        <li>Main Header <code>.app-header</code> . Contains the logo and navbar.</li>
                        <li>Main Sidebar <code>.app-sidebar</code> . Contains the sidebar user panel and menu.</li>
                        <li>Content <code>.app-main</code> . Contains the page header and content.</li>
                        <li>Main Footer <code>.app-footer</code> . Contains the footer.</li>
                      </ul>
                      <h4>Layout Options</h4>
                      <p>
                        AdminLTE v4 provides a set of options to apply to your main layout. Each one of these classes can be added to the <code>body</code> tag to get the desired goal.
                      </p>
                      <ul>
                        <li>Fixed Sidebar: use the class <code>.layout-fixed</code> to get a fixed sidebar.</li>
                        <li>Mini Sidebar on Toggle: use the class <code>.sidebar-expand-* .sidebar-mini</code> to have a collapsed sidebar upon loading.</li>
                        <li>Collapsed Sidebar: use the class <code>.sidebar-expand-* .sidebar-mini .sidebar-collapse</code> to have a collapsed sidebar upon loading.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/offres" element={<GestionOffres />} />
              <Route path="/nouvelle-instance" element={<NouvelleInstance />} />
              <Route path="/iam" element={<GestionIAM />} />
              <Route path="/iam/auth" element={<AuthConfig />} />
              <Route path="/iam/groupes" element={<GestionGroupes />} />
              <Route path="/iam/groupes/:id" element={<EditGroupe />} />
              <Route path="/iam/roles" element={<GestionRoles />} />
              <Route path="/iam/utilisateurs" element={<GestionUtilisateurs />} />
              {/* Ajoutez ici d'autres routes pour les autres pages */}
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
