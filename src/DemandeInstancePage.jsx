import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "./fetchWithAuth";
import { useParams, useNavigate } from "react-router-dom";

export default function DemandeInstancePage() {
  const navigate = useNavigate();
  // Vérifie la présence du token d'authentification
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const { offerId } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState("");
  // Stocke les metadata pour chaque propriété
  const [metadataValues, setMetadataValues] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchWithAuth(`/api/offers/${offerId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
      .then(res => res.ok ? res.json() : Promise.reject("Erreur de chargement de l'offre"))
      .then(data => {
        setOffer(data);
        fetchWithAuth(`/api/offers/${offerId}/properties`, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
          .then(res => res.ok ? res.json() : [])
          .then(async props => {
            setOffer(o => ({ ...o, properties: Array.isArray(props) ? props : [] }));
            const initial = {};
            const metadataPromises = {};
            (Array.isArray(props) ? props : []).forEach(p => {
              initial[p.name] = p.default_value || "";
              if (p.metadata_source) {
                // Prépare la requête pour récupérer les metadata via le bon endpoint
                metadataPromises[p.name] = fetchWithAuth(`/api/domains/${p.metadata_source}/suggested_values`, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
                  .then(res => res.ok ? res.json() : [])
                  .catch(() => []);
              }
            });
            setForm(initial);
            // Récupère toutes les metadata en parallèle
            const metadataResults = await Promise.all(Object.values(metadataPromises));
            const metadataNames = Object.keys(metadataPromises);
            const metadataObj = {};
            metadataNames.forEach((name, idx) => {
              metadataObj[name] = Array.isArray(metadataResults[idx]) ? metadataResults[idx] : [];
            });
            setMetadataValues(metadataObj);
          })
          .catch(() => {
            setOffer(o => ({ ...o, properties: [] }));
            setForm({});
          })
          .finally(() => setLoading(false));
      })
      .catch(e => {
        setError(e.toString());
        setLoading(false);
      });
  }, [offerId]);

  const handleChange = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));

    // Mise à jour dynamique des valeurs dépendantes
    if (offer && Array.isArray(offer.properties)) {
      // Cherche les propriétés qui dépendent de ce champ
      offer.properties.forEach(childProp => {
        if (childProp.depends_on === name && childProp.metadata_source) {
          // Récupère le domain_id du parent
          const parentProp = offer.properties.find(p => p.name === name);
          const parentDomainId = parentProp && parentProp.metadata_source ? parentProp.metadata_source : "";
          const childDomainId = childProp.metadata_source;
          const url = `/api/suggested_values?parent_value=${encodeURIComponent(value)}&parent_domain_id=${encodeURIComponent(parentDomainId)}&domain_id=${encodeURIComponent(childDomainId)}`;
          fetchWithAuth(url, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } })
            .then(res => res.ok ? res.json() : [])
            .then(newValues => {
              setMetadataValues(prev => ({ ...prev, [childProp.name]: Array.isArray(newValues) ? newValues : [] }));
              // Réinitialise la valeur du champ dépendant si le parent change
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

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Construction du payload conforme à l'API
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      const payload = {
        offer_id: Number(offerId),
        validator_id: null,
        properties: Array.isArray(offer.properties)
          ? offer.properties.map(prop => ({
              offer_property_id: prop.id,
              value: form[prop.name]
            }))
          : []
      };
      const res = await fetchWithAuth(`/api/instances`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erreur lors de la demande d'instance");
      setSuccess("Demande envoyée avec succès");
      setTimeout(() => navigate("/instances"), 1200);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-4">Chargement...</div>;
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (!offer) return null;

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h2>Demander une instance : {offer.name}</h2>
      <form className="mt-4" onSubmit={handleSubmit}>
        {Array.isArray(offer.properties) && offer.properties.length > 0 ? (
          offer.properties.map(prop => {
            // Protection : n'affiche jamais de <form> dans le mapping
            if (prop.type === "form" || prop.renderAs === "form") return null;
            return (
              <div className="mb-3" key={prop.name}>
                <label className="form-label">{prop.label || prop.name}</label>
                {/* Gestion dépendance : désactive si dépendant et valeur parent non sélectionnée */}
                {(() => {
                  const isDependent = !!prop.depends_on;
                  const parentValue = isDependent ? form[prop.depends_on] : undefined;
                  const shouldDisable = isDependent && !parentValue;
                  if (prop.metadata_source && Array.isArray(metadataValues[prop.name])) {
                    return (
                      <select
                        className="form-select"
                        value={form[prop.name] || ""}
                        onChange={e => handleChange(prop.name, e.target.value)}
                        required={!!prop.required}
                        disabled={shouldDisable}
                      >
                        <option value="">Sélectionner...</option>
                        {metadataValues[prop.name].map((opt, idx) => (
                          <option key={opt.id || idx} value={opt.real_value ?? opt.id ?? idx}>
                            {opt.display_value ?? opt.label ?? opt.name ?? String(opt)}
                          </option>
                        ))}
                      </select>
                    );
                  } else {
                    return (
                      <input
                        className="form-control"
                        type={prop.type === "number" ? "number" : prop.type === "bool" ? "checkbox" : "text"}
                        value={prop.type === "bool" ? undefined : form[prop.name] || ""}
                        checked={prop.type === "bool" ? !!form[prop.name] : undefined}
                        onChange={e => handleChange(prop.name, prop.type === "bool" ? e.target.checked : e.target.value)}
                        required={!!prop.required}
                        disabled={shouldDisable}
                      />
                    );
                  }
                })()}
                {prop.description && <div className="form-text">{prop.description}</div>}
              </div>
            );
          })
        ) : (
          <div className="text-muted">Aucune propriété à renseigner pour cette offre.</div>
        )}
        <button className="btn btn-success" type="submit" disabled={loading}>Envoyer la demande</button>
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}
