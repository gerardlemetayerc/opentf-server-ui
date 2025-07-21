import React, { useState } from "react";
import { FaClock, FaEdit } from "react-icons/fa";

const initialTasks = [
  { id: 1, name: "Maintenance de la base", schedule: "0 3 * * *", enabled: true },
  { id: 2, name: "State Refresh", schedule: "0 * * * *", enabled: true },
  { id: 3, name: "Purge des logs", schedule: "0 4 * * 0", enabled: false }
];

export default function GestionTachesPlanifiees() {
  const [tasks, setTasks] = useState(initialTasks);
  const [editId, setEditId] = useState(null);

  const toggleTaskEnabled = id => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/configuration" onClick={e => {e.preventDefault(); window.location.href = '/configuration';}}>Configuration</a></li>
          <li className="breadcrumb-item active" aria-current="page">Tâches planifiées</li>
        </ol>
      </nav>
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><FaClock className="me-2 text-primary" />Tâches planifiées</h2>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Planification</th>
                  <th>Activée</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td><code>{t.schedule}</code></td>
                    <td>{t.enabled ? <span className="badge bg-success">Oui</span> : <span className="badge bg-secondary">Non</span>}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => toggleTaskEnabled(t.id)}>{t.enabled ? "Désactiver" : "Activer"}</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditId(t.id)}><FaEdit /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal d'édition (placeholder) */}
      {editId && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Éditer la tâche</h5>
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
