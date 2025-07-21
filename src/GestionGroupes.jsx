import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function GestionGroupes() {
  // Liste des rôles disponibles (à synchroniser avec la vraie source si besoin)
  const rolesDisponibles = [
    { id: 1, nom: "SuperAdmin" },
    { id: 2, nom: "Lecteur" }
  ];
  const [groupes, setGroupes] = useState([
    { id: 1, nom: "Admins", roleId: 1 },
    { id: 2, nom: "Utilisateurs", roleId: 2 }
  ]);
  const [newGroupe, setNewGroupe] = useState("");
  const [newRoleId, setNewRoleId] = useState(rolesDisponibles[0].id);
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item active" aria-current="page">Groupes</li>
        </ol>
      </nav>
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaUsers className="me-2" /> Gestion des groupes
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam")} title="Retour"><span aria-hidden="true">&larr;</span> Retour</button>
        </div>
        <div className="card-body">
          <form className="row g-2 mb-3" onSubmit={e => {
            e.preventDefault();
            if(newGroupe.trim()) {
              setGroupes([
                ...groupes,
                { id: Date.now(), nom: newGroupe, roleId: newRoleId }
              ]);
              setNewGroupe("");
              setNewRoleId(rolesDisponibles[0].id);
            }
          }}>
            <div className="col">
              <input className="form-control" placeholder="Nouveau groupe" value={newGroupe} onChange={e => setNewGroupe(e.target.value)} />
            </div>
            <div className="col">
              <select className="form-select" value={newRoleId} onChange={e => setNewRoleId(Number(e.target.value))}>
                {rolesDisponibles.map(role => (
                  <option key={role.id} value={role.id}>{role.nom}</option>
                ))}
              </select>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" type="submit">Ajouter</button>
            </div>
          </form>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nom du groupe</th>
                  <th>Rôle mappé</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {groupes.map(g => (
                  <tr key={g.id}>
                    <td>{g.nom}</td>
                    <td>{rolesDisponibles.find(r => r.id === g.roleId)?.nom || ""}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/iam/groupes/${g.id}`)}>Éditer</button>
                    </td>
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
