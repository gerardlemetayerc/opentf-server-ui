import React, { useState } from "react";

export default function GestionOffres() {
  const [offres, setOffres] = useState([
    { id: 1, nom: "VM Standard", description: "2 vCPU, 4Go RAM, 50Go SSD" },
    { id: 2, nom: "VM Premium", description: "4 vCPU, 16Go RAM, 200Go SSD" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newNom, setNewNom] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newNom.trim()) return;
    setOffres([
      ...offres,
      { id: Date.now(), nom: newNom, description: newDesc },
    ]);
    setNewNom("");
    setNewDesc("");
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestion des offres</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          Ajouter une offre
        </button>
      </div>
      {showForm && (
        <form className="mb-4" onSubmit={handleAdd}>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Nom de l'offre</label>
              <input className="form-control" value={newNom} onChange={e => setNewNom(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Description</label>
              <input className="form-control" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" type="submit">Valider</button>
            </div>
          </div>
        </form>
      )}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Nom</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {offres.map(offre => (
            <tr key={offre.id}>
              <td>{offre.nom}</td>
              <td>{offre.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
