import React from "react";
import { FaCogs, FaTasks, FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Configuration() {
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/" onClick={e => {e.preventDefault(); navigate('/');}}>Dashboard</a></li>
          <li className="breadcrumb-item active" aria-current="page">Configuration</li>
        </ol>
      </nav>
      <h2 className="mb-4">Configuration du système</h2>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100 text-center panel-hover" style={{ cursor: 'pointer' }} onClick={() => navigate("/configuration/workers") }>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaRobot size={40} className="mb-3 text-primary" />
              <h5 className="card-title">Gestion des workers</h5>
              <p className="card-text">Superviser et configurer les serveurs "opentf-worker" qui gèrent les instances.</p>
              <button className="btn btn-outline-primary mt-2">Gérer</button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 text-center panel-hover" style={{ cursor: 'pointer' }} onClick={() => navigate("/configuration/tasks") }>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaTasks size={40} className="mb-3 text-primary" />
              <h5 className="card-title">Tâches planifiées</h5>
              <p className="card-text">Gérer les tâches planifiées et leur exécution.</p>
              <button className="btn btn-outline-primary mt-2">Gérer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
