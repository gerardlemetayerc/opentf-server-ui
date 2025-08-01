import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { fetchWithAuth } from "./fetchWithAuth";
import Notification from "./Notification";
import { FaGitAlt, FaSyncAlt } from "react-icons/fa";

export default function RepositoryPage() {
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    git_url: "",
    version: "",
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchWithAuth("/api/modules", { method: "GET" })
      .then(res => res.ok ? res.json() : Promise.reject("Erreur de chargement des modules"))
      .then(setModules)
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetchWithAuth("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Erreur lors de la création du module");
      const data = await res.json();
      setSuccess("Module créé !");
      setModules(mods => [...mods, data]);
      setShowModal(false);
      setForm({ name: "", description: "", git_url: "", version: "", active: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRepo = async moduleId => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetchWithAuth(`/api/modules/${moduleId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.updated) {
        setSuccess("Repository mis à jour.");
      } else {
        setError("La mise à jour du repository a échoué.");
      }
    } catch (e) {
      setError("Erreur lors de la mise à jour du repository.");
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un module
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce module ?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetchWithAuth(`/api/modules/${moduleId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du module");
      setModules(mods => mods.filter(m => m.id !== moduleId));
      setSuccess("Module supprimé.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4"><FaGitAlt className="me-2" />Gestion des repository</h2>
      <Notification show={!!error} message={error} onClose={() => setError("")} type="error" />
      <Notification show={!!success} message={success} onClose={() => setSuccess("")} type="success" />
      {loading && <div className="alert alert-info">Chargement...</div>}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={() => setShowModal(true)}><FaGitAlt className="me-1" />Ajouter un module</button>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Ajouter un module"
        ariaHideApp={false}
        style={{ content: { maxWidth: 500, margin: "auto" } }}
      >
        <h4 className="mb-3">Ajouter un module</h4>
        <form onSubmit={handleAddModule}>
          <div className="mb-2">
            <label>Nom</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <label>Description</label>
            <input className="form-control" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label>URL Git</label>
            <input className="form-control" name="git_url" value={form.git_url} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <label>Version</label>
            <input className="form-control" name="version" value={form.version} onChange={handleChange} />
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" name="active" checked={form.active} onChange={handleChange} id="activeCheck" />
            <label className="form-check-label" htmlFor="activeCheck">Actif</label>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>Annuler</button>
            <button className="btn btn-success" type="submit" disabled={loading}>Créer le module</button>
          </div>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
          {success && <div className="alert alert-success mt-2">{success}</div>}
        </form>
      </Modal>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>URL Git</th>
            <th>Version</th>
            <th>Actif</th>
            <th>Créé le</th>
            <th>Mis à jour</th>
            <th colSpan={2}></th>
          </tr>
        </thead>
        <tbody>
          {modules.length === 0 && (
            <tr><td colSpan={9} className="text-center text-muted">Aucun module</td></tr>
          )}
          {modules.map(mod => (
            <tr key={mod.id}>
              <td>{mod.name}</td>
              <td>{mod.description}</td>
              <td><a href={mod.git_url} target="_blank" rel="noopener noreferrer">{mod.git_url}</a></td>
              <td>{mod.version}</td>
              <td>{mod.active ? <span className="badge bg-success">Oui</span> : <span className="badge bg-secondary">Non</span>}</td>
              <td>{mod.created_at ? new Date(mod.created_at).toLocaleString() : ""}</td>
              <td>{mod.updated_at ? new Date(mod.updated_at).toLocaleString() : ""}</td>
              <td>
                <button className="btn btn-outline-info btn-sm me-2" onClick={() => handleUpdateRepo(mod.id)} title="Mettre à jour le repository">
                  <FaSyncAlt className="me-1" />Update repo
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteModule(mod.id)} title="Supprimer le module">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
