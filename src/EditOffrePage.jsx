import React, { useEffect, useState, useRef } from "react";
import { FaServer, FaDatabase, FaGlobe, FaKey, FaShieldAlt, FaUsers, FaUser } from "react-icons/fa";
const iconOptions = [
  { name: 'Server', value: 'FaServer', icon: <FaServer size={20} /> },
  { name: 'Database', value: 'FaDatabase', icon: <FaDatabase size={20} /> },
  { name: 'Globe', value: 'FaGlobe', icon: <FaGlobe size={20} /> },
  { name: 'Key', value: 'FaKey', icon: <FaKey size={20} /> },
  { name: 'Shield', value: 'FaShieldAlt', icon: <FaShieldAlt size={20} /> },
  { name: 'User', value: 'FaUser', icon: <FaUser size={20} /> },
  { name: 'Users', value: 'FaUsers', icon: <FaUsers size={20} /> }
];
const ICONS = {
  FaServer: <FaServer size={20} />, FaDatabase: <FaDatabase size={20} />, FaGlobe: <FaGlobe size={20} />, FaKey: <FaKey size={20} />, FaShieldAlt: <FaShieldAlt size={20} />, FaUser: <FaUser size={20} />, FaUsers: <FaUsers size={20} />
};

// Hook pour charger les catégories
function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    fetch("/api/offer_categories")
      .then(res => res.ok ? res.json() : Promise.reject("Erreur de chargement des catégories"))
      .then(setCategories)
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, []);
  return { categories, loading, error };
}
import { useParams, useNavigate } from "react-router-dom";
import Notification from "./Notification";

export default function EditOffrePage() {
  // Gestion de la modal propriété
  const closePropModal = () => {
    setShowPropForm(false);
    setEditingPropIdx(null);
    setPropForm({ name: "", type: "string", label: "", description: "", required: false, default_value: "", min_value: "", max_value: "", metadata_source: "", depends_on: "", customjs: "" });
  };
  // Flag pour afficher le formulaire d'ajout/édition
  const [showPropForm, setShowPropForm] = useState(false);
  // Gestion du formulaire d'édition/création d'une propriété d'offre
  const [editingPropIdx, setEditingPropIdx] = useState(null); // index de la propriété en édition
  const [propForm, setPropForm] = useState({
    name: "",
    type: "string",
    label: "",
    description: "",
    required: false,
    default_value: "",
    min_value: "",
    max_value: "",
    metadata_source: "",
    depends_on: "",
    customjs: ""
  });
  // State pour la liste des propriétés disponibles pour 'Dépends de'
  const [availableDependsOnProps, setAvailableDependsOnProps] = useState([]);
  // Liste des domaines disponibles pour Source métadonnée (chargée dynamiquement)
  const [domains, setDomains] = useState([]);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [errorDomains, setErrorDomains] = useState("");
  useEffect(() => {
    setLoadingDomains(true);
    fetch("/api/domains")
      .then(res => res.ok ? res.json() : Promise.reject("Erreur de chargement des domaines"))
      .then(data => setDomains(Array.isArray(data) ? data : []))
      .catch(e => setErrorDomains(e.toString()))
      .finally(() => setLoadingDomains(false));
  }, []);

  // Ouvre le formulaire d'édition pour une propriété existante
  const handleEditProp = idx => {
    setEditingPropIdx(idx);
    setPropForm({ ...form.properties[idx] });
    // Calculer la liste des propriétés disponibles pour 'Dépends de' (sauf celle en édition)
    const available = form.properties.filter((p, i) => i !== idx);
    setAvailableDependsOnProps(available);
    setShowPropForm(true);
  };
  // Ouvre le formulaire de création
  const handleNewProp = () => {
    setEditingPropIdx(null);
    setPropForm({
      name: "",
      type: "string",
      label: "",
      description: "",
      required: false,
      default_value: "",
      min_value: "",
      max_value: "",
      metadata_source: "",
      depends_on: "",
      customjs: ""
    });
    // Toutes les propriétés sont disponibles
    setAvailableDependsOnProps(form.properties);
    setShowPropForm(true);
  };

  // Sauvegarde d'une propriété (création ou édition)
  const handleSaveProp = async e => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    console.log("API property payload:", {
      url: editingPropIdx === null ? `/api/offers/${id}/properties` : `/api/offers/${id}/properties/${form.properties[editingPropIdx]?.id}`,
      method: editingPropIdx === null ? "POST" : "PUT",
      payload: {
        name: propForm.name,
        type: propForm.type,
        label: propForm.label,
        required: !!propForm.required,
        description: propForm.description || "",
        default_value: propForm.default_value || "",
        min_value: propForm.min_value || "",
        max_value: propForm.max_value || "",
        metadata_source: propForm.metadata_source || "",
        depends_on: propForm.depends_on || "",
        customjs: propForm.customjs || ""
      }
    });
    try {
      const payload = {
        name: propForm.name,
        type: propForm.type,
        label: propForm.label,
        required: !!propForm.required,
        description: propForm.description || "",
        default_value: propForm.default_value || "",
        min_value: propForm.min_value || "",
        max_value: propForm.max_value || "",
        metadata_source: propForm.metadata_source || "",
        depends_on: propForm.depends_on || "",
        customjs: propForm.customjs || ""
      };
      let res;
      if (editingPropIdx === null) {
        // Création
        res = await fetch(`/api/offers/${id}/properties`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Edition
        const propId = form.properties[editingPropIdx]?.id;
        if (!propId) throw new Error("ID de propriété manquant pour la modification");
        res = await fetch(`/api/offers/${id}/properties/${propId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde de la propriété");
      setSuccess("Propriété enregistrée");
      setEditingPropIdx(null);
      setShowPropForm(false);
      // Recharger uniquement la liste des propriétés
      const propRes = await fetch(`/api/offers/${id}/properties`);
      if (propRes.ok) {
        const newProps = await propRes.json();
        setForm(f => ({ ...f, properties: Array.isArray(newProps) ? newProps : [] }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const { categories, loading: loadingCategories, error: errorCategories } = useCategories();
  const { id } = useParams();
  const navigate = useNavigate();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/offers/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Erreur de chargement"))
      .then(setOffre)
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, [id]);

  // Form state (reprend la logique du modal GestionOffres)
  const [form, setForm] = useState({
    name: "",
    icon: "",
    version: "",
    git_url: "",
    active: true,
    offer_category_id: "",
    properties: []
  });
  useEffect(() => {
    if (offre) {
      setForm(f => ({
        ...f,
        name: offre.name || "",
        icon: offre.icon || "",
        version: offre.version || "",
        git_url: offre.git_url || offre.terraform_repository || "",
        active: !!offre.active,
        offer_category_id:
          (offre.offer_category_id !== undefined && offre.offer_category_id !== null)
            ? String(offre.offer_category_id)
          : (offre.category_id !== undefined && offre.category_id !== null)
            ? String(offre.category_id)
          : (offre.category && offre.category.id !== undefined && offre.category.id !== null)
            ? String(offre.category.id)
          : ""
      }));
    }
  }, [offre]);

  // Effet pour charger dynamiquement la liste des propriétés au montage et à chaque changement d'id
  useEffect(() => {
    if (!id) return;
    fetch(`/api/offers/${id}/properties`)
      .then(res => res.ok ? res.json() : [])
      .then(props => setForm(f => ({ ...f, properties: Array.isArray(props) ? props : [] })))
      .catch(() => setForm(f => ({ ...f, properties: [] })));
  }, [id]);

  // Gestion des propriétés dynamiques
  const handlePropChange = (idx, field, value) => {
    setForm(f => ({
      ...f,
      properties: f.properties.map((p, i) => i === idx ? { ...p, [field]: value } : p)
    }));
  };

  // Dropdown custom pour icônes
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const iconDropdownBtnRef = useRef();
  useEffect(() => {
    if (!showIconDropdown) return;
    function handleClick(e) {
      if (iconDropdownBtnRef.current && !iconDropdownBtnRef.current.contains(e.target)) {
        setShowIconDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showIconDropdown]);
  const handleAddProp = () => setForm(f => ({ ...f, properties: [...f.properties, { key: "", value: "" }] }));
  const handleRemoveProp = async idx => {
    const prop = form.properties[idx];
    if (!prop?.id) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/offers/${id}/properties/${prop.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression de la propriété");
      setSuccess("Propriété supprimée");
      // Recharger la liste des propriétés
      const propRes = await fetch(`/api/offers/${id}/properties`);
      if (propRes.ok) {
        const newProps = await propRes.json();
        setForm(f => ({ ...f, properties: Array.isArray(newProps) ? newProps : [] }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarde
  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Construction du payload attendu par l'API
      const payload = {
        icon: form.icon, // doit être une URL, à adapter selon la logique métier
        name: form.name,
        version: form.version,
        git_url: form.git_url,
        active: !!form.active,
        category_id: form.offer_category_id ? Number(form.offer_category_id) : null
      };
      const res = await fetch(`/api/offers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      setSuccess("Offre modifiée");
      setTimeout(() => navigate("/offres"), 1000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <div className="bg-white shadow rounded p-4">
          <h2 className="mb-4">Édition de l'offre</h2>
          <Notification show={!!error} message={error} onClose={() => setError("")} type="error" />
          <Notification show={!!success} message={success} onClose={() => setSuccess("")} type="success" />
          <form onSubmit={handleSave} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nom</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="col-md-3 position-relative">
              <label className="form-label">Icône</label>
              <div className="d-flex align-items-center gap-2">
                <span style={{ minWidth: 28, minHeight: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {ICONS[form.icon] || <span style={{ width: 20, height: 20 }}></span>}
                </span>
                <select className="form-select" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} required style={{ flex: 1 }}>
                  <option value="">Choisir une icône...</option>
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Catégorie</label>
              <select
                className="form-select"
                value={form.offer_category_id}
                onChange={e => setForm(f => ({ ...f, offer_category_id: e.target.value }))}
                required
                disabled={loadingCategories}
              >
                <option value="">{loadingCategories ? "Chargement..." : "Choisir une catégorie..."}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errorCategories && <div className="text-danger small mt-1">{errorCategories}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Version</label>
              <input className="form-control" value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">URL du module Git</label>
              <input className="form-control" value={form.git_url} onChange={e => setForm(f => ({ ...f, git_url: e.target.value }))} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Propriétés dynamiques</label>
              <div className="table-responsive mb-2">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Type</th>
                      <th>Label</th>
                      <th>Obligatoire</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.properties.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-muted">Aucune propriété</td></tr>
                    )}
                    {form.properties.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.name}</td>
                        <td>{p.type}</td>
                        <td>{p.label}</td>
                        <td>{p.required ? "Oui" : "Non"}</td>
                        <td className="text-end">
                          <button type="button" className="btn btn-outline-primary btn-sm me-1" onClick={() => handleEditProp(idx)}>Éditer</button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveProp(idx)} title="Supprimer">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-outline-success btn-sm mb-2" onClick={handleNewProp}>Ajouter une propriété</button>
              {/* Modal Bootstrap pour le formulaire propriété */}
              {showPropForm && (
                <>
                  <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">{editingPropIdx !== null ? "Éditer une propriété" : "Ajouter une propriété"}</h5>
                          <button type="button" className="btn-close" aria-label="Fermer" onClick={closePropModal}></button>
                        </div>
                        <form onSubmit={handleSaveProp}>
                          <div className="modal-body">
                            {error && <div className="alert alert-danger mb-2">{error}</div>}
                            {success && <div className="alert alert-success mb-2">{success}</div>}
                            <div className="row g-2">
                              <div className="col-md-4">
                                <label className="form-label">Nom (name)</label>
                                <input className="form-control" value={propForm.name} onChange={e => setPropForm(f => ({ ...f, name: e.target.value }))} required />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label">Type</label>
                                <select className="form-select" value={propForm.type} onChange={e => setPropForm(f => ({ ...f, type: e.target.value }))} required>
                                  <option value="string">string</option>
                                  <option value="number">number</option>
                                  <option value="bool">bool</option>
                                  <option value="list">list</option>
                                </select>
                              </div>
                              <div className="col-md-5">
                                <label className="form-label">Label</label>
                                <input className="form-control" value={propForm.label} onChange={e => setPropForm(f => ({ ...f, label: e.target.value }))} required />
                              </div>
                              <div className="col-md-12">
                                <label className="form-label">Description</label>
                                <input className="form-control" value={propForm.description} onChange={e => setPropForm(f => ({ ...f, description: e.target.value }))} />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Obligatoire</label>
                                <select className="form-select" value={propForm.required ? "true" : "false"} onChange={e => setPropForm(f => ({ ...f, required: e.target.value === "true" }))} required>
                                  <option value="true">Oui</option>
                                  <option value="false">Non</option>
                                </select>
                              </div>
                              <div className="col-md-3">
                                <label className="form-label">Valeur par défaut</label>
                                <input className="form-control" value={propForm.default_value} onChange={e => setPropForm(f => ({ ...f, default_value: e.target.value }))} />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Min</label>
                                <input className="form-control" value={propForm.min_value} onChange={e => setPropForm(f => ({ ...f, min_value: e.target.value }))} />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Max</label>
                                <input className="form-control" value={propForm.max_value} onChange={e => setPropForm(f => ({ ...f, max_value: e.target.value }))} />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label">Source métadonnée</label>
                                <select
                                  className="form-select"
                                  value={propForm.metadata_source}
                                  onChange={e => setPropForm(f => ({ ...f, metadata_source: e.target.value }))}
                                  disabled={loadingDomains}
                                >
                                  <option value="">{loadingDomains ? "Chargement..." : "Sélectionner..."}</option>
                                  {domains.map(domain => (
                                    <option key={domain.id || domain.name || domain} value={domain.id || domain.name || domain}>
                                      {domain.label || domain.name || domain}
                                    </option>
                                  ))}
                                </select>
                                {errorDomains && <div className="text-danger small mt-1">{errorDomains}</div>}
                              </div>
                              {/* Liste déroulante pour 'Dépends de' calculée à l'ouverture de la modal */}
                              {availableDependsOnProps.length > 0 && (
                                <div className="col-md-3">
                                  <label className="form-label">Dépend de</label>
                                  <select
                                    className="form-select"
                                    value={propForm.depends_on}
                                    onChange={e => setPropForm(f => ({ ...f, depends_on: e.target.value }))}
                                  >
                                    <option value="">Aucune</option>
                                    {availableDependsOnProps.map((p, idx) => (
                                      <option key={p.id || p.name || idx} value={p.name}>{p.label || p.name}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              <div className="col-md-12">
                                <label className="form-label">Custom JS</label>
                                <textarea className="form-control" rows={2} value={propForm.customjs} onChange={e => setPropForm(f => ({ ...f, customjs: e.target.value }))} />
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-success me-2" disabled={loading} onClick={handleSaveProp}>Enregistrer</button>
                            <button type="button" className="btn btn-secondary" onClick={closePropModal}>Annuler</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* Backdrop Bootstrap */}
                  <div className="modal-backdrop fade show"></div>
                </>
              )}
            </div>
            <div className="col-12">
              <button className="btn btn-success me-2" type="submit" disabled={loading}>Enregistrer</button>
              <button className="btn btn-secondary" type="button" onClick={() => navigate("/offres")}>Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

