import { fetchWithAuth } from "./fetchWithAuth";
import React, { useState, useEffect } from "react";
import Notification from "./Notification";

export default function GestionDomaines() {
  const [domaines, setDomaines] = useState([]);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [suggestedValues, setSuggestedValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newDomaine, setNewDomaine] = useState("");
  const [newValue, setNewValue] = useState({ display_value: "", real_value: "", parent_domain_id: "", parent_value: "" });
  const [editValueId, setEditValueId] = useState(null);
  const [editValue, setEditValue] = useState({ display_value: "", real_value: "", parent_domain_id: "", parent_value: "" });

  // Charger les domaines
  useEffect(() => {
    setLoading(true);
    fetchWithAuth("/api/domains", { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
      .then(res => res.json())
      .then(setDomaines)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Charger les valeurs suggérées du domaine sélectionné
  useEffect(() => {
    if (!selectedDomaine) return setSuggestedValues([]);
    setLoading(true);
    fetchWithAuth(`/api/domains/${selectedDomaine.id}/suggested_values`, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
      .then(res => res.json())
      .then(setSuggestedValues)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedDomaine]);

  // Ajout d'un domaine
  const handleAddDomaine = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetchWithAuth("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDomaine })
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout du domaine");
      const created = await res.json();
      setDomaines(ds => [...ds, created]);
      setNewDomaine("");
      setSuccess("Domaine ajouté");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Ajout d'une valeur suggérée
  const handleAddValue = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        display_value: newValue.display_value,
        real_value: newValue.real_value,
        // parent_domain_id et parent_value sont optionnels
        ...(newValue.parent_domain_id ? { parent_domain_id: parseInt(newValue.parent_domain_id, 10) } : {}),
        ...(newValue.parent_value ? { parent_value: newValue.parent_value } : {})
      };
      const res = await fetchWithAuth(`/api/domains/${selectedDomaine.id}/suggested_values`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout de la valeur");
      const created = await res.json();
      setSuggestedValues(vs => [...vs, created]);
      setNewValue({ display_value: "", real_value: "", parent_domain_id: "", parent_value: "" });
      setSuccess("Valeur suggérée ajoutée");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'une valeur suggérée
  const handleDeleteValue = async (valueId) => {
    if (!window.confirm("Supprimer cette valeur ?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetchWithAuth(`/api/domains/${selectedDomaine.id}/suggested_values/${valueId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression de la valeur");
      setSuggestedValues(vs => vs.filter(v => v.id !== valueId));
      setSuccess("Valeur supprimée");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Edition d'une valeur suggérée
  const handleEditValue = (v) => {
    setEditValueId(v.id);
    setEditValue({
      display_value: v.display_value,
      real_value: v.real_value,
      parent_domain_id: v.parent_domain_id || "",
      parent_value: v.parent_value || ""
    });
  };

  const handleEditValueSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        display_value: editValue.display_value,
        real_value: editValue.real_value,
        ...(editValue.parent_domain_id ? { parent_domain_id: parseInt(editValue.parent_domain_id, 10) } : {}),
        ...(editValue.parent_value ? { parent_value: editValue.parent_value } : {})
      };
      const res = await fetchWithAuth(`/api/domains/${selectedDomaine.id}/suggested_values/${editValueId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erreur lors de la modification de la valeur");
      const updated = await res.json();
      setSuggestedValues(vs => vs.map(v => v.id === editValueId ? updated : v));
      setEditValueId(null);
      setEditValue({ display_value: "", real_value: "", parent_domain_id: "", parent_value: "" });
      setSuccess("Valeur modifiée");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des domaines et valeurs suggérées</h2>
      <Notification show={!!error} message={error} onClose={() => setError("")} type="error" />
      <Notification show={!!success} message={success} onClose={() => setSuccess("")} type="success" />
      <div className="row mt-4">
        <div className="col-md-4">
          <h5>Domaines</h5>
          <form className="mb-3 d-flex" onSubmit={handleAddDomaine}>
            <input className="form-control me-2" value={newDomaine} onChange={e => setNewDomaine(e.target.value)} placeholder="Nouveau domaine" required />
            <button className="btn btn-primary" type="submit" disabled={loading}>Ajouter</button>
          </form>
          <ul className="list-group">
            {domaines.map(d => (
              <li
                key={d.id}
                className={"list-group-item d-flex justify-content-between align-items-center " + (selectedDomaine && d.id === selectedDomaine.id ? "active text-white" : "")}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedDomaine(d)}
              >
                {d.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-8">
          <h5>Valeurs suggérées {selectedDomaine ? `pour "${selectedDomaine.name}"` : ""}</h5>
          {selectedDomaine && (
            <form className="mb-3 row g-2 align-items-end" onSubmit={handleAddValue}>
              <div className="col">
                <input className="form-control" placeholder="Valeur affichée" value={newValue.display_value} onChange={e => setNewValue(v => ({ ...v, display_value: e.target.value }))} required />
              </div>
              <div className="col">
                <input className="form-control" placeholder="Valeur réelle" value={newValue.real_value} onChange={e => setNewValue(v => ({ ...v, real_value: e.target.value }))} required />
              </div>
              <div className="col">
                <select className="form-select" value={newValue.parent_domain_id} onChange={e => setNewValue(v => ({ ...v, parent_domain_id: e.target.value }))}>
                  <option value="">Aucun domaine parent</option>
                  {domaines.filter(d => d.id !== selectedDomaine.id).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input className="form-control" placeholder="Valeur du parent (optionnel)" value={newValue.parent_value} onChange={e => setNewValue(v => ({ ...v, parent_value: e.target.value }))} />
              </div>
              <div className="col-auto">
                <button className="btn btn-success" type="submit" disabled={loading}>Ajouter</button>
              </div>
            </form>
          )}
          <table className="table table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Valeur affichée</th>
                <th>Valeur réelle</th>
                <th>Parent</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {suggestedValues.length === 0 ? (
                <tr><td colSpan={4}><span className="text-muted">Aucune valeur</span></td></tr>
              ) : (
                suggestedValues.map(v => (
                  (!v.parent_domain_id || !v.parent_value ||
                    (domaines.find(d => d.id === v.parent_domain_id) && true)
                  ) && (
                  <tr key={v.id}>
                    {editValueId === v.id ? (
                      <>
                        <td>
                          <input className="form-control" value={editValue.display_value} onChange={e => setEditValue(ev => ({ ...ev, display_value: e.target.value }))} />
                        </td>
                        <td>
                          <input className="form-control" value={editValue.real_value} onChange={e => setEditValue(ev => ({ ...ev, real_value: e.target.value }))} />
                        </td>
                        <td>
                          <select className="form-select mb-1" value={editValue.parent_domain_id} onChange={e => setEditValue(ev => ({ ...ev, parent_domain_id: e.target.value }))}>
                            <option value="">Aucun domaine parent</option>
                            {domaines.filter(d => d.id !== selectedDomaine.id).map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                          <input className="form-control mt-1" placeholder="Valeur du parent (optionnel)" value={editValue.parent_value} onChange={e => setEditValue(ev => ({ ...ev, parent_value: e.target.value }))} />
                        </td>
                        <td>
                          <div className="mt-1">
                            <button className="btn btn-success btn-sm me-2" onClick={handleEditValueSave}>Enregistrer</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditValueId(null)}>Annuler</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{v.display_value}</td>
                        <td>{v.real_value}</td>
                        <td>
                          {v.parent_domain_id ? (
                            <span className="badge bg-info text-dark me-1">{domaines.find(d => d.id === v.parent_domain_id)?.name || v.parent_domain_id} / {v.parent_value}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditValue(v)}>Éditer</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteValue(v.id)}>Supprimer</button>
                        </td>
                      </>
                    )}
                  </tr>
                  )
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
