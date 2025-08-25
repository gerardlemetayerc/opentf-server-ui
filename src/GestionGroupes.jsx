import { fetchWithAuth } from "./fetchWithAuth";
import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";

export default function GestionGroupes() {
  // Liste des rôles disponibles (à synchroniser avec la vraie source si besoin)
  const rolesDisponibles = [
    { id: 1, nom: "SuperAdmin" },
    { id: 2, nom: "Lecteur" }
  ];
  const [groupes, setGroupes] = useState([]);
  const [newGroupe, setNewGroupe] = useState("");
  const [newRoleId, setNewRoleId] = useState(rolesDisponibles[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Charger les groupes depuis l'API
  useEffect(() => {
    setLoading(true);
    fetchWithAuth("/api/groups", { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du chargement des groupes");
        return res.json();
      })
      .then(data => {
        setGroupes(data);
        setError("");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item active" aria-current="page">Groups</li>
        </ol>
      </nav>
      <Notification
        show={!!error}
        message={error}
        onClose={() => setError("")}
        type="error"
      />
      <Notification
        show={!!success}
        message={success}
        onClose={() => setSuccess("")}
        type="success"
      />
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaUsers className="me-2" /> Gestion des groupes
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam")} title="Retour"><span aria-hidden="true">&larr;</span> Back</button>
        </div>
        <div className="card-body">
          <form className="row g-2 mb-3" onSubmit={async e => {
            e.preventDefault();
            if(newGroupe.trim()) {
              setLoading(true);
              setError("");
              setSuccess("");
              try {
                const roleName = rolesDisponibles.find(r => r.id === newRoleId)?.nom;
                const res = await fetchWithAuth("/api/groups", {
                  method: "POST",
                  headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`
                  },
                  body: JSON.stringify({ name: newGroupe, roles: [roleName] })
                });
                if (!res.ok) throw new Error("Erreur lors de la création du groupe");
                const created = await res.json();
                setGroupes(g => [...g, created]);
                setNewGroupe("");
                setNewRoleId(rolesDisponibles[0].id);
                setSuccess("Groupe créé avec succès !");
              } catch (e) {
                setError(e.message);
              } finally {
                setLoading(false);
              }
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
                    <td>{g.name}</td>
                    <td>{g.roles && g.roles.length > 0 ? g.roles.join(", ") : <span className="text-muted">Aucun</span>}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={e => {
                        e.preventDefault();
                        const nouveauNom = prompt("Nouveau nom du groupe :", g.name);
                        if (nouveauNom !== null && nouveauNom.trim() !== "") {
                          const nouveauRole = prompt("Nouveau rôle (séparé par des virgules) :", g.roles ? g.roles.join(",") : "");
                          if (nouveauRole !== null) {
                            setLoading(true);
                            setError("");
                            setSuccess("");
                            fetchWithAuth(`/api/groups/${g.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name: nouveauNom, roles: nouveauRole.split(",").map(r => r.trim()).filter(Boolean) })
                            })
                              .then(res => {
                                if (!res.ok) throw new Error("Erreur lors de la mise à jour du groupe");
                                return res.json();
                              })
                              .then(updated => {
                                setGroupes(gs => gs.map(gr => gr.id === g.id ? updated : gr));
                                setSuccess("Groupe modifié avec succès !");
                              })
                              .catch(e => setError(e.message))
                              .finally(() => setLoading(false));
                          }
                        }
                      }}>Éditer</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={async e => {
                        e.preventDefault();
                        if(window.confirm("Supprimer ce groupe ?")) {
                          setLoading(true);
                          setError("");
                          setSuccess("");
                          try {
                            const res = await fetchWithAuth(`/api/groups/${g.id}`, { method: "DELETE" });
                            if (!res.ok) throw new Error("Erreur lors de la suppression du groupe");
                            await res.json();
                            setGroupes(gs => gs.filter(gr => gr.id !== g.id));
                            setSuccess("Groupe supprimé avec succès !");
                          } catch (e) {
                            setError(e.message);
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}>Supprimer</button>
                    </td>
                  </tr>
                ))}
          {loading && <div className="alert alert-info mt-2">Chargement...</div>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
