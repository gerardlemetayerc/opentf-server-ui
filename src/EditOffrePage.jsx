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
      setForm({
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
          : "",
        properties: Array.isArray(offre.properties) ? offre.properties : []
      });
    }
  }, [offre]);

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
  const handleRemoveProp = idx => setForm(f => ({ ...f, properties: f.properties.filter((_, i) => i !== idx) }));

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
              {form.properties.map((p, idx) => (
                <div className="row mb-2" key={idx}>
                  <div className="col">
                    <input className="form-control" placeholder="Clé" value={p.key} onChange={e => handlePropChange(idx, "key", e.target.value)} />
                  </div>
                  <div className="col">
                    <input className="form-control" placeholder="Valeur" value={p.value} onChange={e => handlePropChange(idx, "value", e.target.value)} />
                  </div>
                  <div className="col-auto d-flex align-items-center">
                    <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveProp(idx)} title="Supprimer">×</button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={handleAddProp}>Ajouter une propriété</button>
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

