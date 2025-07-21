import React, { useState } from "react";
import { FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AuthConfig() {
  // Permet d'activer OIDC en plus du local
  const [localEnabled, setLocalEnabled] = useState(true);
  const [oidcEnabled, setOidcEnabled] = useState(false);
  const [oidcConfig, setOidcConfig] = useState({
    issuer: "",
    clientId: "",
    clientSecret: "",
    scopes: "openid profile email",
    tokenEndpoint: "",
    authorizationEndpoint: "",
    claims: {
      nom: "",
      prenom: "",
      mail: "",
      groupes: "",
      displayName: ""
    }
  });
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item active" aria-current="page">Authentification</li>
        </ol>
      </nav>
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaKey className="me-2" /> Configuration de l'authentification
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam")} title="Retour"><span aria-hidden="true">&larr;</span> Retour</button>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Méthodes d'authentification activées</label>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="localAuth" checked={localEnabled} onChange={e => setLocalEnabled(e.target.checked)} />
              <label className="form-check-label" htmlFor="localAuth">Locale (base de comptes interne)</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="oidcAuth" checked={oidcEnabled} onChange={e => setOidcEnabled(e.target.checked)} />
              <label className="form-check-label" htmlFor="oidcAuth">OIDC (Azure AD, Google, etc.)</label>
            </div>
          </div>
          {oidcEnabled && (
            <>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Issuer (URL)</label>
                  <input className="form-control" value={oidcConfig.issuer} onChange={e => setOidcConfig({ ...oidcConfig, issuer: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Client ID</label>
                  <input className="form-control" value={oidcConfig.clientId} onChange={e => setOidcConfig({ ...oidcConfig, clientId: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Client Secret</label>
                  <input className="form-control" value={oidcConfig.clientSecret} onChange={e => setOidcConfig({ ...oidcConfig, clientSecret: e.target.value })} type="password" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Scopes</label>
                  <input className="form-control" value={oidcConfig.scopes} onChange={e => setOidcConfig({ ...oidcConfig, scopes: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Token endpoint</label>
                  <input className="form-control" value={oidcConfig.tokenEndpoint} onChange={e => setOidcConfig({ ...oidcConfig, tokenEndpoint: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Authorization endpoint</label>
                  <input className="form-control" value={oidcConfig.authorizationEndpoint} onChange={e => setOidcConfig({ ...oidcConfig, authorizationEndpoint: e.target.value })} />
                </div>
              </div>
              <div className="mt-4">
                <h6>Mapping des claims OIDC</h6>
                <div className="row g-2">
                  <div className="col-md-4">
                    <label className="form-label">Nom</label>
                    <input className="form-control" value={oidcConfig.claims.nom} onChange={e => setOidcConfig({ ...oidcConfig, claims: { ...oidcConfig.claims, nom: e.target.value } })} placeholder="claim OIDC pour le nom" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Prénom</label>
                    <input className="form-control" value={oidcConfig.claims.prenom} onChange={e => setOidcConfig({ ...oidcConfig, claims: { ...oidcConfig.claims, prenom: e.target.value } })} placeholder="claim OIDC pour le prénom" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Mail</label>
                    <input className="form-control" value={oidcConfig.claims.mail} onChange={e => setOidcConfig({ ...oidcConfig, claims: { ...oidcConfig.claims, mail: e.target.value } })} placeholder="claim OIDC pour le mail" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Groupes</label>
                    <input className="form-control" value={oidcConfig.claims.groupes} onChange={e => setOidcConfig({ ...oidcConfig, claims: { ...oidcConfig.claims, groupes: e.target.value } })} placeholder="claim OIDC pour les groupes" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Nom d'affichage</label>
                    <input className="form-control" value={oidcConfig.claims.displayName} onChange={e => setOidcConfig({ ...oidcConfig, claims: { ...oidcConfig.claims, displayName: e.target.value } })} placeholder="claim OIDC pour le nom d'affichage" />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="mt-3">
            <button className="btn btn-success">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
     );
}
