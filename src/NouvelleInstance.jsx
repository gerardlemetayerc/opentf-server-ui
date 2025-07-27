import React, { useEffect, useState } from "react";
import { FaServer, FaDatabase, FaGlobe, FaKey, FaShieldAlt, FaUsers, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ICONS = {
  FaServer: <FaServer size={32} />, FaDatabase: <FaDatabase size={32} />, FaGlobe: <FaGlobe size={32} />, FaKey: <FaKey size={32} />, FaShieldAlt: <FaShieldAlt size={32} />, FaUser: <FaUser size={32} />, FaUsers: <FaUsers size={32} />
};

export default function NouvelleInstance() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/api/offers")
      .then(res => res.ok ? res.json() : Promise.reject("Erreur de chargement des offres"))
      .then(data => setOffers(Array.isArray(data) ? data : []))
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, []);

  // Extraire les catégories uniques des offres
  const categories = Array.from(new Set(offers.map(o => o.category?.name || o.category_name || o.offer_category_name || o.categorie || "Autre")));

  const handleSelect = offerId => {
    navigate(`/demande-instance/${offerId}`);
  };

  return (
    <div className="container mt-4">
      <h2>Nouvelle instance</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        categories.map(cat => (
          <div key={cat} className="mb-4">
            <h4 className="mb-3">{cat}</h4>
            <div className="row g-3">
              {offers.filter(o => (o.category?.name || o.category_name || o.offer_category_name || o.categorie || "Autre") === cat).length === 0 && (
                <div className="col-12 text-muted">Aucune offre dans cette catégorie.</div>
              )}
              {offers.filter(o => (o.category?.name || o.category_name || o.offer_category_name || o.categorie || "Autre") === cat).map(offre => (
                <div key={offre.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card h-100 shadow-sm text-center p-3">
                    <div className="mb-2 text-primary">
                      {ICONS[offre.icon] || <FaServer size={32} />}
                    </div>
                    <div className="fw-bold mb-1">{offre.name || offre.nom}</div>
                    <div className="text-muted small mb-2">{offre.description || ""}</div>
                    <button className="btn btn-outline-primary btn-sm mt-auto" onClick={() => handleSelect(offre.id)}>Sélectionner</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
