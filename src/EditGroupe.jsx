import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import AddItemModal from "./AddItemModal";

// Données simulées (à remplacer par un fetch API/backend)
const rolesDisponibles = [
  { id: 1, nom: "SuperAdmin" },
  { id: 2, nom: "Lecteur" },
  { id: 3, nom: "Opérateur" }
];
const membresDisponibles = [
  { id: 1, nom: "Alice" },
  { id: 2, nom: "Bob" },
  { id: 3, nom: "Charlie" }
];

export default function EditGroupe() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simule un fetch du groupe par id
  const [groupe, setGroupe] = useState({
    id,
    nom: `Groupe ${id}`,
    roles: [1],
    membres: [],
    actif: true
  });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMembreModal, setShowMembreModal] = useState(false);

  const handleAddRole = (role) => {
    setGroupe(g => ({ ...g, roles: g.roles.includes(role.id) ? g.roles : [...g.roles, role.id] }));
    setShowRoleModal(false);
  };
  const handleRemoveRole = (roleId) => {
    setGroupe(g => ({ ...g, roles: g.roles.filter(r => r !== roleId) }));
  };
  const handleAddMembre = (membre) => {
    setGroupe(g => ({ ...g, membres: g.membres.includes(membre.id) ? g.membres : [...g.membres, membre.id] }));
    setShowMembreModal(false);
  };
  const handleRemoveMembre = (membreId) => {
    setGroupe(g => ({ ...g, membres: g.membres.filter(m => m !== membreId) }));
  };

  const handleActifChange = () => {
    setGroupe(g => ({ ...g, actif: !g.actif }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Envoyer la mise à jour au backend
    navigate("/iam/groupes");
  };

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam/groupes');}}>Groupes</a></li>
          <li className="breadcrumb-item active" aria-current="page">Édition</li>
        </ol>
      </nav>
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaUsers className="me-2" /> Édition du groupe
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam/groupes")} title="Retour"><span aria-hidden="true">&larr;</span> Retour</button>
        </div>
        <form className="card-body" onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Nom du groupe</label>
            <input className="form-control" value={groupe.nom} onChange={e => setGroupe(g => ({ ...g, nom: e.target.value }))} />
          </div>
          <div className="mb-3">
            <label className="form-label">Rôles associés</label>
            <div className="table-responsive mb-2">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr><th>Nom du rôle</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {groupe.roles.map(roleId => {
                    const role = rolesDisponibles.find(r => r.id === roleId);
                    return role ? (
                      <tr key={role.id}>
                        <td>{role.nom}</td>
                        <td><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveRole(role.id)}>Retirer</button></td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-outline-primary" onClick={() => setShowRoleModal(true)}>Ajouter un rôle</button>
          </div>
          <div className="mb-3">
            <label className="form-label">Membres du groupe</label>
            <div className="table-responsive mb-2">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr><th>Nom</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {groupe.membres.map(membreId => {
                    const membre = membresDisponibles.find(m => m.id === membreId);
                    return membre ? (
                      <tr key={membre.id}>
                        <td>{membre.nom}</td>
                        <td><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveMembre(membre.id)}>Retirer</button></td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-outline-primary" onClick={() => setShowMembreModal(true)}>Ajouter un membre</button>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="actif" checked={groupe.actif} onChange={handleActifChange} />
            <label className="form-check-label" htmlFor="actif">Groupe actif</label>
          </div>
          <button className="btn btn-success" type="submit">Enregistrer</button>
        </form>
      </div>
      <AddItemModal
        show={showRoleModal}
        onHide={() => setShowRoleModal(false)}
        items={rolesDisponibles.filter(r => !groupe.roles.includes(r.id))}
        onSelect={handleAddRole}
        title="Ajouter un rôle au groupe"
        placeholder="Rechercher un rôle..."
      />
      <AddItemModal
        show={showMembreModal}
        onHide={() => setShowMembreModal(false)}
        items={membresDisponibles.filter(m => !groupe.membres.includes(m.id))}
        onSelect={handleAddMembre}
        title="Ajouter un membre au groupe"
        placeholder="Rechercher un membre..."
      />
    </div>
  );
}
