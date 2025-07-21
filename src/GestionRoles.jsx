import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function GestionRoles() {
  const [roles, setRoles] = useState([
    { id: 1, nom: "SuperAdmin" },
    { id: 2, nom: "Lecteur" }
  ]);
  const [newRole, setNewRole] = useState("");
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item active" aria-current="page">Rôles</li>
        </ol>
      </nav>
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaUserShield className="me-2" /> Gestion des rôles
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam")} title="Retour"><span aria-hidden="true">&larr;</span> Retour</button>
        </div>
        <div className="card-body">
          <form className="row g-2 mb-3" onSubmit={e => {e.preventDefault(); if(newRole.trim()) { setRoles([...roles, { id: Date.now(), nom: newRole }]); setNewRole(""); }}}>
            <div className="col">
              <input className="form-control" placeholder="Nouveau rôle" value={newRole} onChange={e => setNewRole(e.target.value)} />
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" type="submit">Ajouter</button>
            </div>
          </form>
          <ul className="list-group">
            {roles.map(r => <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">{r.nom}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
