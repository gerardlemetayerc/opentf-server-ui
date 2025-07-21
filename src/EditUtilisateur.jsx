import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

// Données simulées (à remplacer par un fetch API/backend)
const utilisateurs = [
  { id: 1, prenom: "Alice", nom: "Dupont", displayName: "Alice Dupont", email: "alice@exemple.com", source: "local", actif: true },
  { id: 2, prenom: "Bob", nom: "Martin", displayName: "Bob Martin", email: "bob@exemple.com", source: "oidc", actif: false },
  { id: 3, prenom: "Charlie", nom: "", displayName: "Charlie", email: "charlie@exemple.com", source: "local", actif: true }
];

export default function EditUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Simule un fetch de l'utilisateur par id
  const userInit = utilisateurs.find(u => u.id === Number(id)) || {
    id,
    prenom: "",
    nom: "",
    displayName: "",
    email: "",
    source: "local",
    actif: true
  };
  const [user, setUser] = useState(userInit);

  const handleChange = e => {
    const { name, value } = e.target;
    setUser(u => ({ ...u, [name]: value }));
  };

  const handleSave = e => {
    e.preventDefault();
    // TODO: Envoyer la mise à jour au backend
    navigate("/iam/utilisateurs");
  };

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam/utilisateurs');}}>Utilisateurs</a></li>
          <li className="breadcrumb-item active" aria-current="page">Édition</li>
        </ol>
      </nav>
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaUser className="me-2" /> Édition de l'utilisateur
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam/utilisateurs")} title="Retour"><span aria-hidden="true">&larr;</span> Retour</button>
        </div>
        <form className="card-body" onSubmit={handleSave}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Prénom</label>
              <input className="form-control" name="prenom" value={user.prenom} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nom</label>
              <input className="form-control" name="nom" value={user.nom} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nom affiché</label>
              <input className="form-control" name="displayName" value={user.displayName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" name="email" value={user.email} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Source d'authentification</label>
              <input className="form-control" value={user.source === "oidc" ? "OIDC" : "Locale"} disabled readOnly />
            </div>
          </div>
          <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" id="actif" checked={user.actif} onChange={() => setUser(u => ({ ...u, actif: !u.actif }))} />
            <label className="form-check-label" htmlFor="actif">Utilisateur actif</label>
          </div>
          <button className="btn btn-success mt-3" type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  );
}
