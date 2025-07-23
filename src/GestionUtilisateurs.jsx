import React, { useState, useEffect } from "react";
import Notification from "./Notification";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function GestionUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", status: "active", auth_source: "locale", password: "" });
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Charger les utilisateurs
  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        return res.json();
      })
      .then(data => {
        setUtilisateurs(data);
        setError("");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Ajouter un utilisateur
  const handleAddUser = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) throw new Error("Erreur lors de la création de l'utilisateur");
      const created = await res.json();
      setUtilisateurs(u => [...u, created]);
      setNewUser({ first_name: "", last_name: "", email: "", status: "active", auth_source: "locale", password: "" });
      setSuccess("Utilisateur ajouté avec succès.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async id => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      await res.json();
      setUtilisateurs(u => u.filter(user => user.id !== id));
      setSuccess("Utilisateur supprimé avec succès.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Notification
        show={!!success}
        message={success}
        onClose={() => setSuccess("")}
      />
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
          <form className="row g-2 mb-3" onSubmit={handleAddUser}>
            <div className="col-md-2"><input className="form-control" placeholder="Prénom" value={newUser.first_name} onChange={e => setNewUser(u => ({ ...u, first_name: e.target.value }))} required /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Nom" value={newUser.last_name} onChange={e => setNewUser(u => ({ ...u, last_name: e.target.value }))} required /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} required /></div>
            <div className="col-md-2">
              <select className="form-select" value={newUser.auth_source} onChange={e => setNewUser(u => ({ ...u, auth_source: e.target.value }))}>
                <option value="locale">Locale</option>
                <option value="oidc">OIDC</option>
              </select>
            </div>
            <div className="col-md-1">
              <select className="form-select" value={newUser.status} onChange={e => setNewUser(u => ({ ...u, status: e.target.value }))}>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div className="col-md-1">
              <input className="form-control" placeholder="Mot de passe" type="password" value={newUser.password} onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))} required={newUser.auth_source === "locale"} disabled={newUser.auth_source !== "locale"} />
            </div>
            <div className="col-md-1 d-grid">
              <button className="btn btn-primary" type="submit" disabled={loading}>Ajouter</button>
            </div>
          </form>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map(u => (
                  <tr key={u.id}>
                    <td>{u.first_name}</td>
                    <td>{u.last_name}</td>
                    <td>{u.email}</td>
                    <td>{u.auth_source}</td>
                    <td>{u.status === "active" ? "Actif" : "Inactif"}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate(`/iam/users/${u.id}`)}>Éditer</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="alert alert-info mt-2">Chargement...</div>}
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
