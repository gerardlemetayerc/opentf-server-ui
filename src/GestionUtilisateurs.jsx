import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

// Données simulées (à remplacer par un fetch API/backend)
const utilisateurs = [
  { id: 1, displayName: "Alice Dupont", source: "local", groupes: ["Admins"], actif: true },
  { id: 2, displayName: "Bob Martin", source: "oidc", groupes: ["Utilisateurs", "Lecteurs"], actif: false },
  { id: 3, displayName: "Charlie", source: "local", groupes: [], actif: true }
];

export default function GestionUtilisateurs() {
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item active" aria-current="page">Utilisateurs</li>
        </ol>
      </nav>
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaUser className="me-2" /> Gestion des utilisateurs
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam")} title="Retour"><span aria-hidden="true">&larr;</span> Retour</button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Nom affiché</th>
                  <th>Source d'authentification</th>
                  <th>Groupes</th>
                  <th>Actif</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map(u => (
                  <tr key={u.id}>
                    <td>{u.displayName}</td>
                    <td>{u.source === "oidc" ? "OIDC" : "Locale"}</td>
                    <td>{u.groupes.length > 0 ? u.groupes.join(", ") : <span className="text-muted">Aucun</span>}</td>
                    <td>{u.actif ? <span className="badge bg-success">Oui</span> : <span className="badge bg-secondary">Non</span>}</td>
                    <td><button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/iam/users/${u.id}`)}>Éditer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
