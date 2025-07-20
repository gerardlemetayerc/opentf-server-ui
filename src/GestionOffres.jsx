

import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaServer, FaDatabase, FaGlobe, FaKey, FaShieldAlt, FaUsers, FaUser } from "react-icons/fa";


export default function GestionOffres() {
  const categories = [
    "Infrastructure",
    "Identité & Accès",
    "Réseaux & DNS",
    "Sécurité & Certificats",
    "Applications & Intégrations",
    "Automatisation & Orchestration"
  ];
  const iconOptions = [
    { name: 'Server', value: 'FaServer', icon: <FaServer size={20} />, technical: 'FaServer' },
    { name: 'Database', value: 'FaDatabase', icon: <FaDatabase size={20} />, technical: 'FaDatabase' },
    { name: 'Globe', value: 'FaGlobe', icon: <FaGlobe size={20} />, technical: 'FaGlobe' },
    { name: 'Key', value: 'FaKey', icon: <FaKey size={20} />, technical: 'FaKey' },
    { name: 'Shield', value: 'FaShieldAlt', icon: <FaShieldAlt size={20} />, technical: 'FaShieldAlt' },
    { name: 'User', value: 'FaUser', icon: <FaUser size={20} />, technical: 'FaUser' },
    { name: 'Users', value: 'FaUsers', icon: <FaUsers size={20} />, technical: 'FaUsers' }
  ];

  const [offres, setOffres] = useState([
    { id: 1, nom: "VM Windows Server", description: "Machine virtuelle Windows Server", categorie: "Infrastructure", icon: <FaServer title="Serveur" size={20} /> },
    { id: 2, nom: "VM SQL Server", description: "Machine virtuelle SQL Server (base de données)", categorie: "Infrastructure", icon: <FaDatabase title="Base de données" size={20} /> },
    { id: 3, nom: "Entrée DNS", description: "Création d'une entrée DNS interne", categorie: "Réseaux & DNS", icon: <FaGlobe title="DNS" size={20} /> },
    { id: 4, nom: "Compte de service", description: "Provisionnement d'un compte de service AD", categorie: "Identité & Accès", icon: <FaKey title="Compte de service" size={20} /> },
    { id: 5, nom: "Certificat PKI", description: "Certificat utilisateur ou serveur via PKI Windows", categorie: "Sécurité & Certificats", icon: <FaShieldAlt title="Certificat" size={20} /> },
    { id: 6, nom: "Enterprise App Entra", description: "Déploiement d'une application d'entreprise dans Entra", categorie: "Identité & Accès", icon: <FaUsers title="App Entra" size={20} /> },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newNom, setNewNom] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState(categories[0]);
  const [newIcon, setNewIcon] = useState(iconOptions[0].value);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newNom.trim()) return;
    const iconObj = iconOptions.find(opt => opt.value === newIcon);
    setOffres([
      ...offres,
      {
        id: Date.now(),
        nom: newNom,
        description: newDesc,
        categorie: newCat,
        icon: iconObj ? iconObj.icon : null
      },
    ]);
    setNewNom("");
    setNewDesc("");
    setNewCat(categories[0]);
    setNewIcon(iconOptions[0].value);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestion des offres</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Ajouter une offre
        </button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <form onSubmit={handleAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une offre</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Titre de l'offre</label>
              <input className="form-control" value={newNom} onChange={e => setNewNom(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Icône</label>
              <select className="form-select" value={newIcon} onChange={e => setNewIcon(e.target.value)}>
                {iconOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                {iconOptions.find(opt => opt.value === newIcon)?.icon}
                <span className="ms-2 text-muted small"></span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Catégorie</label>
              <select className="form-select" value={newCat} onChange={e => setNewCat(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input className="form-control" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="success" type="submit">
              Valider
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Icône</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Catégorie</th>
          </tr>
        </thead>
        <tbody>
          {offres.map(offre => (
            <tr key={offre.id}>
              <td className="text-center">{offre.icon}</td>
              <td>{offre.nom}</td>
              <td>{offre.description}</td>
              <td>{offre.categorie}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
