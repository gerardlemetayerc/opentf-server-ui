import React from "react";
import { FaKey, FaUsers, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function GestionIAM() {
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <h2>Gestion IAM</h2>
      <div className="row g-4 mt-4">
        <div className="col-md-3">
          <div className="card h-100 text-center panel-hover" style={{ cursor: 'pointer' }} onClick={() => navigate("/iam/auth") }>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaKey size={40} className="mb-3 text-primary" />
              <h5 className="card-title">Authentification</h5>
              <p className="card-text">Configurer le type d'authentification (locale ou OIDC).</p>
              <button className="btn btn-outline-primary mt-2">Configurer</button>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-center panel-hover" style={{ cursor: 'pointer' }} onClick={() => navigate("/iam/utilisateurs") }>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaUser size={40} className="mb-3 text-primary" />
              <h5 className="card-title">Utilisateurs</h5>
              <p className="card-text">Gérer les utilisateurs, leurs groupes et rôles.</p>
              <button className="btn btn-outline-primary mt-2">Gérer</button>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-center panel-hover" style={{ cursor: 'pointer' }} onClick={() => navigate("/iam/groupes") }>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaUsers size={40} className="mb-3 text-primary" />
              <h5 className="card-title">Groupes</h5>
              <p className="card-text">Créer et gérer les groupes d'utilisateurs.</p>
              <button className="btn btn-outline-primary mt-2">Gérer</button>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-center panel-hover" style={{ cursor: 'pointer' }} onClick={() => navigate("/iam/roles") }>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaUserShield size={40} className="mb-3 text-primary" />
              <h5 className="card-title">Rôles</h5>
              <p className="card-text">Définir et attribuer les rôles de sécurité.</p>
              <button className="btn btn-outline-primary mt-2">Gérer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
