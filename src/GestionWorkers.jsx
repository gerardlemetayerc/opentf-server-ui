import React, { useState } from "react";
import { FaRobot, FaPlus, FaEdit } from "react-icons/fa";

// Données simulées pour les workers
const initialWorkers = [
  { id: 1, name: "worker-01", os: "Linux", status: "active", lastSeen: "2025-07-21 10:12" },
  { id: 2, name: "worker-02", os: "Windows", status: "inactive", lastSeen: "2025-07-20 18:45" }
];

function generateToken() {
  // Simule un token généré par le backend
  return Math.random().toString(36).substring(2, 18).toUpperCase();
}

export default function GestionWorkers() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [showAdd, setShowAdd] = useState(false);
  const [token, setToken] = useState("");
  const [editId, setEditId] = useState(null);

  const handleShowAdd = () => {
    setToken(generateToken());
    setShowAdd(true);
  };

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/configuration" onClick={e => {e.preventDefault(); window.location.href = '/configuration';}}>Configuration</a></li>
          <li className="breadcrumb-item active" aria-current="page">Workers</li>
        </ol>
      </nav>
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><FaRobot className="me-2 text-primary" />Gestion des workers</h2>
        <button className="btn btn-primary" onClick={handleShowAdd}><FaPlus className="me-1" /> Ajouter un worker</button>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Système d'exploitation</th>
                  <th>Statut</th>
                  <th>Dernière communication</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {workers.map(w => (
                  <tr key={w.id}>
                    <td>{w.name}</td>
                    <td>{w.os}</td>
                    <td>{w.status === "active" ? <span className="badge bg-success">Actif</span> : <span className="badge bg-secondary">Inactif</span>}</td>
                    <td>{w.lastSeen}</td>
                    <td><button className="btn btn-sm btn-outline-secondary" onClick={() => setEditId(w.id)}><FaEdit /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal d'ajout */}
      {showAdd && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Token d'enregistrement</h5>
                <button type="button" className="btn-close" onClick={() => setShowAdd(false)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <strong>Utilisez ce token pour enregistrer un nouveau worker.</strong>
                </div>
                <div className="mb-3">
                  <label className="form-label">Token généré</label>
                  <input className="form-control" value={token} readOnly />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal d'édition (placeholder) */}
      {editId && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Éditer le worker</h5>
                <button type="button" className="btn-close" onClick={() => setEditId(null)}></button>
              </div>
              <div className="modal-body">
                <p>Fonctionnalité à venir.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditId(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
