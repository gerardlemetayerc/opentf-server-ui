import React, { useState, useEffect } from "react";
import Modal from "react-modal";
// Utilitaire pour afficher n'importe quelle valeur de façon sûre
function renderValue(val) {
  if (val == null) return "";
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return val;
  if (Array.isArray(val)) return val.map(renderValue).join(", ");
  if (typeof val === "object") return val.name || val.label || val.id || JSON.stringify(val);
  return String(val);
}
import { FaEdit } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "./fetchWithAuth";
import { InstanceLifecycleFlow } from "./InstanceLifecycleFlow";

export default function GestionInstanceDetail() {
  const [lifecycleModalOpen, setLifecycleModalOpen] = useState(false);
  const params = useParams();
  const instanceid = params.instanceid || params.id;
  const navigate = useNavigate();
  const [instance, setInstance] = useState(null);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const [metadataValues, setMetadataValues] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    // Charge l'instance
    fetchWithAuth(`/api/instances/${instanceid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        // La gestion du token expiré/invalide est maintenant globale dans fetchWithAuth
        if (!res.ok) throw new Error("Erreur de chargement de l'instance");
        const data = await res.json();
        setInstance(data);
        // Pré-remplit le formulaire d'édition avec les valeurs actuelles
        if (Array.isArray(data.properties)) {
          const initialForm = {};
          data.properties.forEach(p => {
            initialForm[p.offer_property_id] = p.value;
          });
          setForm(initialForm);
        }
        // Récupère les infos générales et les propriétés de l'offre
        const offerId = data.offer_id || (typeof data.offer === "object" ? data.offer.id : null);
        if (offerId) {
          const [offerRes, propRes] = await Promise.all([
            fetchWithAuth(`/api/offers/${offerId}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetchWithAuth(`/api/offers/${offerId}/properties`, { headers: { Authorization: `Bearer ${token}` } })
          ]);
          if (offerRes.status === 401 || offerRes.status === 403) {
            localStorage.removeItem("auth_token");
            navigate("/login");
            throw new Error("Session expirée ou token invalide");
          }
          const offerInfo = offerRes.ok ? await offerRes.json() : {};
          const offerProperties = propRes.ok ? await propRes.json() : [];
          setOffer({
            ...offerInfo,
            properties: offerProperties
          });
        }
      })
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, [instanceid, navigate]);

  // Ouvre la modale d'édition
  const handleEdit = () => {
    // Pré-remplit le formulaire avec les valeurs courantes de l'instance
    if (Array.isArray(instance?.properties)) {
      const initialForm = {};
      instance.properties.forEach(p => {
        // On utilise prop.name si possible, sinon offer_property_id
        const propDef = offer?.properties?.find(op => op.id === p.offer_property_id);
        const key = propDef?.name || p.offer_property_id;
        initialForm[key] = p.value;
      });
      setForm(initialForm);
    }
    setEditModalOpen(true);
    setSuccess("");
    setError("");
    // Précharge les metadata pour les propriétés avec metadata_source
    if (offer && Array.isArray(offer.properties)) {
      offer.properties.forEach(prop => {
        if (prop.metadata_source) {
          // Si la propriété dépend d'un parent, on ne charge que si le parent est bien initialisé
          if (prop.depends_on) {
            const parentValue = form[prop.depends_on];
            if (!parentValue) return; // Ne charge pas tant que le parent n'est pas défini
          }
          let url = `/api/suggested_values?domain_id=${encodeURIComponent(prop.metadata_source)}`;
          if (prop.depends_on) {
            const parentValue = form[prop.depends_on];
            const parentProp = offer.properties.find(p => p.name === prop.depends_on);
            const parentDomainId = parentProp?.metadata_source || "";
            if (parentValue) {
              url += `&parent_value=${encodeURIComponent(parentValue)}&parent_domain_id=${encodeURIComponent(parentDomainId)}`;
            }
          }
          fetchWithAuth(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
          })
            .then(res => res.ok ? res.json() : [])
            .then(values => {
              setMetadataValues(prev => ({ ...prev, [prop.name]: Array.isArray(values) ? values : [] }));
            })
            .catch(() => {
              setMetadataValues(prev => ({ ...prev, [prop.name]: [] }));
            });
        }
      });
    }
  };
  // Gère le changement d'un champ du formulaire d'édition
  const handleFormChange = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    // Mise à jour dynamique des valeurs dépendantes
    if (offer && Array.isArray(offer.properties)) {
      offer.properties.forEach(childProp => {
        if (childProp.depends_on === name && childProp.metadata_source) {
          // On construit l'URL selon le format attendu
          let url = `/api/suggested_values?domain_id=${encodeURIComponent(childProp.metadata_source)}`;
          if (value) {
            // On cherche le domain_id du parent
            const parentProp = offer.properties.find(p => p.name === name);
            const parentDomainId = parentProp?.metadata_source || "";
            url += `&parent_value=${encodeURIComponent(value)}&parent_domain_id=${encodeURIComponent(parentDomainId)}`;
          }
          fetchWithAuth(url, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
            .then(res => res.ok ? res.json() : [])
            .then(newValues => {
              setMetadataValues(prev => ({ ...prev, [childProp.name]: Array.isArray(newValues) ? newValues : [] }));
              // On réinitialise la valeur du champ dépendant si le parent change
              setForm(f => ({ ...f, [childProp.name]: "" }));
            })
            .catch(() => {
              setMetadataValues(prev => ({ ...prev, [childProp.name]: [] }));
              setForm(f => ({ ...f, [childProp.name]: "" }));
            });
        }
      });
    }
  };

  // Soumet le formulaire d'édition
  const handleEditSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("auth_token");
    try {
      // Construction du payload conforme à l'API
      const propertiesPayload = Array.isArray(offer.properties)
        ? offer.properties.map(prop => ({
            offer_property_id: prop.id,
            value: form[prop.name]
          }))
        : [];
      const res = await fetchWithAuth(`/api/instances/${instanceid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ properties: propertiesPayload })
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      const updated = await res.json();
      setInstance(updated);
      setEditModalOpen(false);
      setSuccess("Instance mise à jour avec succès.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-4"><div>Chargement...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!instance || !offer) return null;

  // Mapping propriétés : [{label, name, value, type, id}]
  const mappedProperties = Array.isArray(offer.properties)
    ? offer.properties.map(prop => {
        let value = "";
        if (Array.isArray(instance.properties)) {
          const instProp = instance.properties.find(ip => ip.offer_property_id === prop.id);
          value = instProp ? instProp.value : "";
        }
        return {
          label: prop.label || prop.name,
          name: prop.name,
          value,
          type: prop.type || "string",
          id: prop.id
        };
      })
    : [];

  return (
    <div className="container mt-4">
      <Modal
        isOpen={lifecycleModalOpen}
        onRequestClose={() => setLifecycleModalOpen(false)}
        contentLabel="Cycle de vie de l'instance"
        ariaHideApp={false}
        style={{ content: { maxWidth: 700, margin: "auto", maxHeight: 750, height: 750, overflow: "auto", padding: 24 } }}
      >
        <h5 className="mb-3">Cycle de vie de l'instance</h5>
        <InstanceLifecycleFlow currentStatus={instance.status} />
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary" type="button" onClick={() => setLifecycleModalOpen(false)}>Fermer</button>
        </div>
      </Modal>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/instances" onClick={e => {e.preventDefault(); window.location.href = '/instances';}}>Instances managées</a></li>
          <li className="breadcrumb-item active" aria-current="page">{instance.name}</li>
        </ol>
      </nav>
      <div className="card mb-4">
        <div className="card-header d-flex align-items-start justify-content-between">
          <div className="d-flex flex-column">
            <div>
              <span className="fw-bold">Offre : </span> 
              {renderValue(offer.name)} <span className="badge bg-secondary ms-2">v{renderValue(offer.version)}</span>
            </div>
            <div>
              <span className="fw-bold">Statut : </span> 
              {renderValue(instance.status)}
              <button
                type="button"
                className="btn btn-link btn-sm ms-2"
                style={{ verticalAlign: 'middle', textDecoration: 'none', padding: 0 }}
                onClick={() => setLifecycleModalOpen(true)}
                title="Voir le cycle de vie"
              >
                <FaSearch style={{ marginRight: 4 }} /> Où j'en suis ?
              </button>
            </div>
            {/* Affichage du champ nom d'instance si configuré */}
            {offer.name_property_id && mappedProperties.length > 0 && (
              <div className="mt-2">
                <span className="fw-bold">Nom de l'instance : </span>
                {(() => {
                  const nameProp = mappedProperties.find(p => p.id === offer.name_property_id);
                  return nameProp ? renderValue(nameProp.value) : <span className="text-muted">Non renseigné</span>;
                })()}
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          {/* Infos générales de l'offre */}
          <div className="mb-3">
            {offer.description && <div><strong>Description :</strong> {renderValue(offer.description)}</div>}
            {offer.author && <div><strong>Auteur :</strong> {renderValue(offer.author)}</div>}
            {offer.category && <div><strong>Catégorie :</strong> {renderValue(offer.category)}</div>}
            {offer.tags && Array.isArray(offer.tags) && offer.tags.length > 0 && (
              <div><strong>Tags :</strong> {renderValue(offer.tags)}</div>
            )}
          </div>
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Propriété</th>
                <th>Valeur</th>
              </tr>
            </thead>
            <tbody>
              {mappedProperties.map((prop, idx) => (
                <tr key={idx}>
                  <td>{renderValue(prop.label)}</td>
                  <td>{renderValue(prop.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-sm btn-outline-primary" onClick={handleEdit}><FaEdit className="me-1" />Éditer</button>
            {instance.status !== "ImpactAnalysis" && (
              <button className="btn btn-warning btn-sm" type="button" disabled={loading} onClick={async () => {
                setLoading(true);
                setError("");
                setSuccess("");
                const token = localStorage.getItem("auth_token");
                try {
                  // PATCH pour changer le statut
                  const res = await fetchWithAuth(`/api/instances/${instanceid}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ status: "ImpactAnalysis" })
                  });
                  if (!res.ok) throw new Error("Erreur lors du changement de statut");
                  const updated = await res.json();
                  setInstance(updated);
                  setSuccess("Instance soumise pour analyse d'impact.");
                } catch (e) {
                  setError(e.message);
                } finally {
                  setLoading(false);
                }
              }}>Soumettre</button>
            )}
          </div>
          {/* Modal d'édition des propriétés */}
          <Modal
            isOpen={editModalOpen}
            onRequestClose={() => setEditModalOpen(false)}
            contentLabel="Éditer l'instance"
            ariaHideApp={false}
            style={{ content: { maxWidth: 600, margin: "auto" } }}
          >
            <h4>Éditer l'instance : {instance.name}</h4>
            <form onSubmit={handleEditSubmit} className="mt-3">
              {Array.isArray(offer.properties) && offer.properties.length > 0 ? (
                offer.properties.map(prop => {
                  if (prop.type === "form" || prop.renderAs === "form") return null;
                  const isDependent = !!prop.depends_on;
                  const parentValue = isDependent ? form[prop.depends_on] : undefined;
                  const shouldDisable = isDependent && !parentValue;
                  if (prop.metadata_source && Array.isArray(metadataValues[prop.name])) {
                    // Filtrage des options selon la valeur du parent si dépendance
                    let options = metadataValues[prop.name];
                    if (prop.depends_on && form[prop.depends_on]) {
                      options = options.filter(opt => {
                        // On suppose que l'API renvoie déjà les valeurs filtrées, mais on vérifie côté client
                        // Si opt.parent_value ou opt.parent_id existe, on compare avec la valeur sélectionnée
                        if (opt.parent_value !== undefined) {
                          return opt.parent_value === form[prop.depends_on];
                        }
                        if (opt.parent_id !== undefined) {
                          return String(opt.parent_id) === String(form[prop.depends_on]);
                        }
                        // Si pas d'info parent, on garde tout
                        return true;
                      });
                    }
                    return (
                      <div className="mb-3" key={prop.name}>
                        <label className="form-label">{prop.label || prop.name}</label>
                        <select
                          className="form-select"
                          value={form[prop.name] || ""}
                          onChange={e => handleFormChange(prop.name, e.target.value)}
                          required={!!prop.required}
                          disabled={shouldDisable}
                        >
                          <option value="">Sélectionner...</option>
                          {options.map((opt, idx) => (
                            <option key={opt.id || idx} value={opt.real_value ?? opt.id ?? idx}>
                              {opt.display_value ?? opt.label ?? opt.name ?? String(opt)}
                            </option>
                          ))}
                        </select>
                        {prop.description && <div className="form-text">{prop.description}</div>}
                      </div>
                    );
                  } else {
                    return (
                      <div className="mb-3" key={prop.name}>
                        <label className="form-label">{prop.label || prop.name}</label>
                        <input
                          className="form-control"
                          type={prop.type === "number" ? "number" : prop.type === "bool" ? "checkbox" : "text"}
                          value={prop.type === "bool" ? undefined : form[prop.name] || ""}
                          checked={prop.type === "bool" ? !!form[prop.name] : undefined}
                          onChange={e => handleFormChange(prop.name, prop.type === "bool" ? e.target.checked : e.target.value)}
                          required={!!prop.required}
                          disabled={shouldDisable}
                        />
                        {prop.description && <div className="form-text">{prop.description}</div>}
                      </div>
                    );
                  }
                })
              ) : (
                <div className="text-muted">Aucune propriété à renseigner pour cette offre.</div>
              )}
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" type="button" onClick={() => setEditModalOpen(false)}>Annuler</button>
                <button className="btn btn-primary" type="submit" disabled={loading}>Enregistrer</button>
              </div>
              {success && <div className="alert alert-success mt-3">{success}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
