import React, { useState } from "react";
import { FaServer, FaCogs, FaDownload, FaEdit, FaCube } from "react-icons/fa";

const fakeInstance = {
  id: 1,
  name: "Instance-Alpha",
  status: "OK",
  offer: "VM Standard",
  module: "opentf-vm",
  options: { cpu: 4, ram: "8GB", disk: "100GB", cost: "" },
  state: {
    resources: [
      { type: "azurerm_linux_virtual_machine", name: "vm1", id: "vm-123", status: "OK" },
      { type: "azurerm_network_interface", name: "nic1", id: "nic-456", status: "Need apply" },
      { type: "azurerm_public_ip", name: "ip1", id: "ip-789", status: "Tainted" }
    ]
  },
  logs: [
    { id: 1, name: "provision.log", size: "12KB", url: "/logs/provision.log" },
    { id: 2, name: "apply.log", size: "8KB", url: "/logs/apply.log" }
  ]
};

export default function GestionInstanceDetail() {
  const [instance, setInstance] = useState(fakeInstance);
  const [editOptions, setEditOptions] = useState(false);
  const [options, setOptions] = useState(instance.options);
  const [showImpact, setShowImpact] = useState(false);
  // Simule une analyse d'impact
  const impactResources = [
    { type: "azurerm_linux_virtual_machine", name: "vm1", action: "update" },
    { type: "azurerm_network_interface", name: "nic1", action: "replace" }
  ];

  const handleEdit = () => setEditOptions(true);
  const handleSave = e => {
    e.preventDefault();
    setInstance(i => ({ ...i, options }));
    setEditOptions(false);
    setShowImpact(true);
  };

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/instances" onClick={e => {e.preventDefault(); window.location.href = '/instances';}}>Instances managées</a></li>
          <li className="breadcrumb-item active" aria-current="page">{instance.name}</li>
        </ol>
      </nav>
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <FaServer className="me-2 text-primary" />
              <span className="fw-bold">Détail de l'instance</span>
              <span className={`badge bg-success ms-3`}>{instance.status}</span>
            </div>
            <div className="card-body">
              <div className="mb-2"><strong>Offre :</strong> {instance.offer}</div>
              <div className="mb-2"><strong>Module associé :</strong> <FaCube className="me-1" />{instance.module}</div>
              <div className="mb-2"><strong>Options :</strong> {!editOptions ? (
                <>
                  <span className="me-2">CPU: {instance.options.cpu}</span>
                  <span className="me-2">RAM: {instance.options.ram}</span>
                  <span className="me-2">Disque: {instance.options.disk}</span>
                  {instance.options.cost && <span className="me-2">Coût estimé: {instance.options.cost} €/mois</span>}
                  <button className="btn btn-sm btn-outline-secondary ms-2" onClick={handleEdit}><FaEdit className="me-1" />Éditer</button>
                </>
              ) : (
                <>
                  <form className="row g-2 align-items-end" onSubmit={handleSave}>
                    <div className="col-auto">
                      <label className="form-label">CPU</label>
                      <input className="form-control" type="number" value={options.cpu} onChange={e => setOptions(o => ({ ...o, cpu: e.target.value }))} />
                    </div>
                    <div className="col-auto">
                      <label className="form-label">RAM</label>
                      <input className="form-control" value={options.ram} onChange={e => setOptions(o => ({ ...o, ram: e.target.value }))} />
                    </div>
                    <div className="col-auto">
                      <label className="form-label">Disque</label>
                      <input className="form-control" value={options.disk} onChange={e => setOptions(o => ({ ...o, disk: e.target.value }))} />
                    </div>
                    <div className="col-auto">
                      <label className="form-label">Coût estimé (optionnel)</label>
                      <input className="form-control" placeholder="€/mois" value={options.cost || ""} onChange={e => setOptions(o => ({ ...o, cost: e.target.value }))} />
                    </div>
                    <div className="col-auto">
                      <button className="btn btn-success" type="submit">Enregistrer</button>
                      <button className="btn btn-secondary ms-2" type="button" onClick={() => setEditOptions(false)}>Annuler</button>
                    </div>
                  </form>
                </>
              )}
              </div>
              {showImpact && (
                <div className="alert alert-warning mt-3">
                  <strong>Ressources nécessitant une mise à jour :</strong>
                  <ul className="mb-0">
                    {impactResources.map((r, i) => (
                      <li key={i}><span className="badge bg-info me-2">{r.action}</span>{r.type} <span className="text-muted">{r.name}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-header"><FaCogs className="me-2 text-primary" />Ressources associées au state</div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Nom</th>
                      <th>ID</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instance.state.resources.map((r, i) => (
                      <tr key={i}>
                        <td>{r.type}</td>
                        <td>{r.name}</td>
                        <td>{r.id}</td>
                        <td>
                          {r.status === "OK" && <span className="badge bg-success">OK</span>}
                          {r.status === "Need apply" && <span className="badge bg-warning text-dark">Need apply</span>}
                          {r.status === "Tainted" && <span className="badge bg-danger">Tainted</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">Logs de provisionning</div>
            <div className="card-body">
              <ul className="list-group">
                {instance.logs.map(log => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={log.id}>
                    <span>{log.name} <span className="text-muted">({log.size})</span></span>
                    <a href={log.url} download className="btn btn-sm btn-outline-secondary"><FaDownload className="me-1" />Télécharger</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
