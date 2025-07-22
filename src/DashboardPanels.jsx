import React from "react";
import { FaServer, FaCheckCircle, FaHourglassHalf, FaWallet, FaEuroSign } from "react-icons/fa";

// Données fictives pour le budget
const budgetEquipe = 12000; // en euros
const budgetConsomme = 3400; // en euros

// Simulated current user and team
const currentUser = "alice";
const currentTeam = "Admins";

// Simulated instances data (should be shared with GestionInstances in real app)
const instances = [
  { id: 1, name: "Instance-Alpha", user: "alice", group: "Admins", status: "OK", offer: "VM Standard" },
  { id: 2, name: "Instance-Beta", user: "bob", group: "Utilisateurs", status: "WaitingforProvisionning", offer: "DB MySQL" },
  { id: 3, name: "Instance-Gamma", user: "charlie", group: "Admins", status: "Tainted", offer: "VM GPU" },
  { id: 4, name: "Instance-Delta", user: "david", group: "Utilisateurs", status: "En attente d'approbation", offer: "DB PostgreSQL" }
];

export default function DashboardPanels() {
  // Count for my team
  const teamCount = instances.filter(inst => inst.group === currentTeam).length;
  // Count requested by me
  const myCount = instances.filter(inst => inst.user === currentUser).length;
  // Count pending my approval (simulate: status 'En attente d\'approbation' and group === my team)
  const pendingApproval = instances.filter(inst => inst.status === "En attente d'approbation" && inst.group === currentTeam).length;

  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaServer size={32} className="mb-2 text-primary" />
              <h5 className="card-title">Instances de mon équipe</h5>
              <span className="display-5 fw-bold">{teamCount}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaCheckCircle size={32} className="mb-2 text-success" />
              <h5 className="card-title">Demandées par moi</h5>
              <span className="display-5 fw-bold">{myCount}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaHourglassHalf size={32} className="mb-2 text-warning" />
              <h5 className="card-title">Approbations en attente</h5>
              <span className="display-5 fw-bold">{pendingApproval}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card text-center h-100 shadow-sm border-primary">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaWallet size={32} className="mb-2 text-primary" />
              <h5 className="card-title">Budget alloué à mon équipe</h5>
              <span className="display-5 fw-bold">{budgetEquipe.toLocaleString()} €</span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-center h-100 shadow-sm border-success">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <FaEuroSign size={32} className="mb-2 text-success" />
              <h5 className="card-title">Budget consommé sur mes instances</h5>
              <span className="display-5 fw-bold">{budgetConsomme.toLocaleString()} €</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
