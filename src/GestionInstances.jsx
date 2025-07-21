import React, { useState } from "react";
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

const initialInstances = [
  { id: 1, name: "Instance-Alpha", user: "alice", group: "Admins", status: "OK", offer: "VM Standard" },
  { id: 2, name: "Instance-Beta", user: "bob", group: "Utilisateurs", status: "WaitingforProvisionning", offer: "DB MySQL" },
  { id: 3, name: "Instance-Gamma", user: "charlie", group: "Admins", status: "Tainted", offer: "VM GPU" },
  { id: 4, name: "Instance-Delta", user: "david", group: "Utilisateurs", status: "En attente d'approbation", offer: "DB PostgreSQL" }
];

export default function GestionInstances() {
  const [instances] = useState(initialInstances);
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
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Demandeur</th>
                  <th>Équipe</th>
                  <th>Type d'offre</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {instances.map(inst => (
                  <tr key={inst.id}>
                    <td>{inst.name}</td>
                    <td>{inst.user}</td>
                    <td>{inst.group}</td>
                    <td>{inst.offer}</td>
                    <td><span className={`badge bg-${statusMap[inst.status] || 'secondary'}`}>{inst.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/instance/${inst.id}`)}><FaEdit className="me-1" />Gérer</button>
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
