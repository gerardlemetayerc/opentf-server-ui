

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { FaServer, FaDatabase, FaGlobe, FaKey, FaShieldAlt, FaUsers, FaUser } from "react-icons/fa";

const ICONS = {
  FaServer: <FaServer size={20} />, FaDatabase: <FaDatabase size={20} />, FaGlobe: <FaGlobe size={20} />, FaKey: <FaKey size={20} />, FaShieldAlt: <FaShieldAlt size={20} />, FaUser: <FaUser size={20} />, FaUsers: <FaUsers size={20} />
};
const iconOptions = [
  { name: 'Server', value: 'FaServer', icon: <FaServer size={20} /> },
  { name: 'Database', value: 'FaDatabase', icon: <FaDatabase size={20} /> },
  { name: 'Globe', value: 'FaGlobe', icon: <FaGlobe size={20} /> },
  { name: 'Key', value: 'FaKey', icon: <FaKey size={20} /> },
  { name: 'Shield', value: 'FaShieldAlt', icon: <FaShieldAlt size={20} /> },
  { name: 'User', value: 'FaUser', icon: <FaUser size={20} /> },
  { name: 'Users', value: 'FaUsers', icon: <FaUsers size={20} /> }
];

export default function GestionOffres() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formNom, setFormNom] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCat, setFormCat] = useState("");
  const [formIcon, setFormIcon] = useState(iconOptions[0].value);
  const [formActive, setFormActive] = useState(true);
  const [formRepo, setFormRepo] = useState("");
  const [formProps, setFormProps] = useState([]); // [{key, value}]

  // Charger catégories et offres
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/offer_categories").then(r => r.json()),
      fetch("/api/offers").then(r => r.json())
    ])
      .then(([cats, offs]) => {
        setCategories(cats);
        setOffres(offs);
        setNewCat(cats[0]?.id || "");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Ouvre le modal pour ajout ou édition
  const openModal = (offre = null) => {
    if (offre) {
      setEditId(offre.id);
      setFormNom(offre.name);
      setFormDesc(offre.description || "");
      setFormCat(offre.category_id || offre.category?.id || (categories[0]?.id || ""));
      setFormIcon(offre.icon || iconOptions[0].value);
      setFormActive(offre.active !== undefined ? offre.active : true);
      setFormRepo(offre.repository || "");
      setFormProps(Array.isArray(offre.properties) ? offre.properties : (offre.properties ? Object.entries(offre.properties).map(([key, value]) => ({ key, value })) : []));
    } else {
      setEditId(null);
      setFormNom("");
      setFormDesc("");
      setFormCat(categories[0]?.id || "");
      setFormIcon(iconOptions[0].value);
      setFormActive(true);
      setFormRepo("");
      setFormProps([]);
    }
    setShowModal(true);
  };

  // Ajout ou édition d'une offre
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Transforme les propriétés en objet clé/valeur
      const properties = {};
      formProps.forEach(({ key, value }) => {
        if (key) properties[key] = value;
      });
      const payload = {
        name: formNom,
        description: formDesc,
        category_id: parseInt(formCat, 10),
        icon: formIcon,
        active: formActive,
        repository: formRepo,
        properties
      };
      let res, data;
      if (editId) {
        res = await fetch(`/api/offers/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Erreur lors de la modification de l'offre");
        data = await res.json();
        setOffres(os => os.map(o => o.id === editId ? data : o));
        setSuccess("Offre modifiée");
      } else {
        res = await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Erreur lors de l'ajout de l'offre");
        data = await res.json();
        setOffres(os => [...os, data]);
        setSuccess("Offre ajoutée");
      }
      setShowModal(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'une offre
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette offre ?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setOffres(os => os.filter(o => o.id !== id));
      setSuccess("Offre supprimée");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des offres de service</h2>
      <Notification show={!!error} message={error} onClose={() => setError("")} type="error" />
      <Notification show={!!success} message={success} onClose={() => setSuccess("")} type="success" />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={() => openModal()}>
          Ajouter une offre
        </button>
      </div>
      {/* Modal d'ajout/édition */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form onSubmit={handleSave} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Éditer l'offre" : "Ajouter une offre"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nom de l'offre</label>
                  <input className="form-control" value={formNom} onChange={e => setFormNom(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input className="form-control" value={formDesc} onChange={e => setFormDesc(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Catégorie</label>
                  <select className="form-select" value={formCat} onChange={e => setFormCat(e.target.value)} required>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Icône</label>
                  <select className="form-select" value={formIcon} onChange={e => setFormIcon(e.target.value)}>
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.name}</option>
                    ))}
                  </select>
                  <div className="mt-2">{iconOptions.find(opt => opt.value === formIcon)?.icon}</div>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" checked={formActive} onChange={e => setFormActive(e.target.checked)} id="activeCheck" />
                  <label className="form-check-label" htmlFor="activeCheck">Active</label>
                </div>
                <div className="mb-3">
                  <label className="form-label">Repository source Terraform</label>
                  <input className="form-control" value={formRepo} onChange={e => setFormRepo(e.target.value)} placeholder="URL ou identifiant du repo" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Propriétés personnalisées</label>
                  {formProps.map((prop, idx) => (
                    <div className="input-group mb-1" key={idx}>
                      <input className="form-control" placeholder="Clé" value={prop.key} onChange={e => setFormProps(props => props.map((p, i) => i === idx ? { ...p, key: e.target.value } : p))} />
                      <input className="form-control" placeholder="Valeur" value={prop.value} onChange={e => setFormProps(props => props.map((p, i) => i === idx ? { ...p, value: e.target.value } : p))} />
                      <button type="button" className="btn btn-outline-danger" onClick={() => setFormProps(props => props.filter((_, i) => i !== idx))}>×</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={() => setFormProps(props => [...props, { key: "", value: "" }])}>Ajouter une propriété</button>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-success">Valider</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Icône</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Catégorie</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {offres.map(offre => (
            <tr key={offre.id}>
              <td className="text-center">{ICONS[offre.icon] || offre.icon}</td>
              <td className="d-flex align-items-center gap-2">{offre.name}</td>
              <td>{offre.description}</td>
              <td>{offre.category?.name || categories.find(c => c.id === offre.category_id)?.name || offre.category_id}</td>
              <td>{offre.active ? <span className="badge bg-success">Oui</span> : <span className="badge bg-secondary">Non</span>}</td>
              <td>
                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => navigate(`/offres/${offre.id}/edit`)}>Éditer</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(offre.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
