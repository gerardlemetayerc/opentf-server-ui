import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "./fetchWithAuth";
import { FaServer, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const statusMap = {
  OK: "success",
  Tainted: "warning",
  Deleted: "danger",
  WaitingforProvisionning: "secondary",
  InProvisionning: "info",
  "En attente d'approbation": "primary"
};


export default function GestionInstances() {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    fetchWithAuth("/api/instances", { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
      .then(res => res.ok ? res.json() : Promise.reject("Erreur de chargement des instances"))
      .then(data => setInstances(Array.isArray(data) ? data : []))
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, []);
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/" onClick={e => {e.preventDefault(); window.location.href = '/';}}>Dashboard</a></li>
          <li className="breadcrumb-item active" aria-current="page">Instances managées</li>
        </ol>
      </nav>
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><FaServer className="me-2 text-primary" />Instances managées</h2>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Demandeur</th>
                    <th>Type d'offre</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {instances.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-muted">Aucune instance trouvée.</td></tr>
                  )}
                  {instances.map(inst => (
                    <tr key={inst.id}>
                      <td>{inst.instance_name}</td>
                      <td>{inst.requester_displayname || inst.user || inst.requester?.email || ""}</td>
                      <td>{inst.offer_name || inst.offer || inst.offer?.name || ""}</td>
                      <td><span className={`badge bg-${statusMap[inst.status] || 'secondary'}`}>{inst.status}</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/instance/${inst.id}`)}><FaEdit className="me-1" />Gérer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
