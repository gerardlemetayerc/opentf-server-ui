import React from "react";
import { BsShieldLock, BsCloud, BsPeople, BsKey, BsDiagram3, BsGlobe2, BsBoxSeam, BsDatabase } from "react-icons/bs";
import { FaServer } from "react-icons/fa";

const offres = [
  { id: 1, nom: "VM Windows Server", categorie: "Infrastructure", icon: <FaServer size={32} />, description: "Machine virtuelle Windows Server" },
  { id: 2, nom: "VM SQL Server", categorie: "Infrastructure", icon: <BsDatabase size={32} />, description: "Machine virtuelle SQL Server (base de données)" },
  { id: 3, nom: "Entrée DNS", categorie: "Réseaux & DNS", icon: <BsGlobe2 size={32} />, description: "Création d'une entrée DNS interne" },
  { id: 4, nom: "Compte de service", categorie: "Identité & Accès", icon: <BsKey size={32} />, description: "Provisionnement d'un compte de service AD" },
  { id: 5, nom: "Certificat PKI", categorie: "Sécurité & Certificats", icon: <BsShieldLock size={32} />, description: "Certificat utilisateur ou serveur via PKI Windows" },
  { id: 6, nom: "Enterprise App Entra", categorie: "Identité & Accès", icon: <BsPeople size={32} />, description: "Déploiement d'une application d'entreprise dans Entra" },
  { id: 7, nom: "Relaying Party Trust", categorie: "Identité & Accès", icon: <BsDiagram3 size={32} />, description: "Ajout d'une fédération SAML/OAuth" },
  { id: 8, nom: "Déploiement d'app", categorie: "Applications & Intégrations", icon: <BsBoxSeam size={32} />, description: "Déploiement d'une application d'entreprise" },
];

const categories = [
  "Infrastructure",
  "Identité & Accès",
  "Réseaux & DNS",
  "Sécurité & Certificats",
  "Applications & Intégrations",
  "Automatisation & Orchestration"
];

export default function NouvelleInstance() {
  return (
    <div className="container mt-4">
      <h2>Nouvelle instance</h2>
      {categories.map(cat => (
        <div key={cat} className="mb-4">
          <h4 className="mb-3">{cat}</h4>
          <div className="row g-3">
            {offres.filter(o => o.categorie === cat).length === 0 && (
              <div className="col-12 text-muted">Aucune offre dans cette catégorie.</div>
            )}
            {offres.filter(o => o.categorie === cat).map(offre => (
              <div key={offre.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm text-center p-3">
                  <div className="mb-2 text-primary">{offre.icon}</div>
                  <div className="fw-bold mb-1">{offre.nom}</div>
                  <div className="text-muted small mb-2">{offre.description}</div>
                  <button className="btn btn-outline-primary btn-sm mt-auto" disabled>Sélectionner</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
