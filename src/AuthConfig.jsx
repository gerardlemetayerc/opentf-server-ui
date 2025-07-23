import React, { useState, useEffect } from "react";
import Notification from "./Notification";
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
    strict: false,
    claims: {
      nom: "",
      prenom: "",
      mail: "",
      groupes: "",
      displayName: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [info, setInfo] = useState("");

  // Charger les méthodes d'authentification et la config OIDC si besoin
  useEffect(() => {
    setLoading(true);
    fetch("/api/iam/auth_methods", {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de la récupération des méthodes d'authentification");
        return res.json();
      })
      .then(methods => {
        // methods = [{ method: 'local', enabled: true }, { method: 'oidc', enabled: false }]
        const local = methods.find(m => m.method === 'local');
        const oidc = methods.find(m => m.method === 'oidc');
        setLocalEnabled(!!local?.enabled);
        setOidcEnabled(!!oidc?.enabled);
        if (oidc?.enabled) {
          // Charger la config OIDC seulement si activée
          fetch("/api/iam/auth/oidc", {
            method: "GET",
            credentials: "include"
          })
            .then(async res => {
              let data;
              try {
                data = await res.json();
              } catch {
                data = {};
              }
              if (data && data.error === "OIDC config not found") {
                setInfo("La configuration OIDC doit être initialisée.");
                setOidcConfig({
                  issuer: "",
                  clientId: "",
                  clientSecret: "",
                  scopes: "openid profile email",
                  tokenEndpoint: "",
                  authorizationEndpoint: "",
                  strict: false,
                  claims: { nom: "", prenom: "", mail: "", groupes: "", displayName: "" }
                });
                setError("");
              } else if (!res.ok) {
                setError("Erreur lors de la récupération de la configuration OIDC");
              } else {
                setOidcConfig({
                  issuer: data.issuer || "",
                  clientId: data.clientId || "",
                  clientSecret: data.clientSecret || "",
                  scopes: data.scopes || "openid profile email",
                  tokenEndpoint: data.tokenEndpoint || "",
                  authorizationEndpoint: data.authorizationEndpoint || "",
                  strict: !!data.strict,
                  claims: {
                    nom: data.claims?.nom || "",
                    prenom: data.claims?.prenom || "",
                    mail: data.claims?.mail || "",
                    groupes: data.claims?.groupes || "",
                    displayName: data.claims?.displayName || ""
                  }
                });
                setInfo("");
                setError("");
              }
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Enregistrer la config OIDC et les méthodes d'authentification
  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      // Met à jour les méthodes d'authentification
      await fetch("/api/iam/auth_methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ method: "local", enabled: localEnabled })
      });
      await fetch("/api/iam/auth_methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ method: "oidc", enabled: oidcEnabled })
      });
      // Si OIDC activé, enregistre la config OIDC
      if (oidcEnabled) {
        await fetch("/api/iam/auth/oidc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(oidcConfig)
        });
      }
      setSuccess(true);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item active" aria-current="page">Authentification</li>
        </ol>
      </nav>
      <Notification
        show={!!info}
        message={info}
        onClose={() => setInfo("")}
        type="info"
      />
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaKey className="me-2" /> Configuration de l'authentification
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam")} title="Retour"><span aria-hidden="true">&larr;</span> Retour</button>
        </div>
        <div className="card-body">
          <Notification
            show={!!error}
            message={error}
            onClose={() => setError("")}
            type="error"
          />
          <Notification
            show={success}
            message="Configuration enregistrée !"
            onClose={() => setSuccess(false)}
            type="success"
          />
          {loading && <div className="alert alert-info">Chargement...</div>}
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label">Méthodes d'authentification activées</label>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="localAuth" checked={localEnabled} onChange={async e => {
                  const checked = e.target.checked;
                  setLocalEnabled(checked);
                  setLoading(true);
                  setError("");
                  try {
                    await fetch("/api/iam/auth_methods", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ method: "local", enabled: checked })
                    });
                  } catch (err) {
                    setError("Erreur lors de la modification de la méthode local");
                  } finally {
                    setLoading(false);
                  }
                }} />
                <label className="form-check-label" htmlFor="localAuth">Locale (base de comptes interne)</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="oidcAuth" checked={oidcEnabled} onChange={async e => {
                  const checked = e.target.checked;
                  setOidcEnabled(checked);
                  setLoading(true);
                  setError("");
                  try {
                    await fetch("/api/iam/auth_methods", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ method: "oidc", enabled: checked })
                    });
                    if (checked) {
                      // Charger la config OIDC si activé
                      const res = await fetch("/api/iam/auth/oidc", {
                        method: "GET",
                        credentials: "include"
                      });
                      if (!res.ok) throw new Error("Erreur lors de la récupération de la configuration OIDC");
                      const data = await res.json();
                      setOidcConfig({
                        issuer: data.issuer || "",
                        clientId: data.clientId || "",
                        clientSecret: data.clientSecret || "",
                        scopes: data.scopes || "openid profile email",
                        tokenEndpoint: data.tokenEndpoint || "",
                        authorizationEndpoint: data.authorizationEndpoint || "",
                        claims: {
                          nom: data.claims?.nom || "",
                          prenom: data.claims?.prenom || "",
                          mail: data.claims?.mail || "",
                          groupes: data.claims?.groupes || "",
                          displayName: data.claims?.displayName || ""
                        }
                      });
                    }
                  } catch (err) {
                    setError("Erreur lors de la modification de la méthode OIDC");
                  } finally {
                    setLoading(false);
                  }
                }} />
                <label className="form-check-label" htmlFor="oidcAuth">OIDC (Azure AD, Google, etc.)</label>
              </div>
            </div>
            {oidcEnabled && (
              <>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="oidcStrict"
                    checked={oidcConfig.strict}
                    onChange={e => setOidcConfig(cfg => ({ ...cfg, strict: e.target.checked }))}
                  />
                  <label className="form-check-label" htmlFor="oidcStrict">
                    Mode strict OIDC (les groupes ne seront lu que depuis OIDC)
                  </label>
                </div>
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
              <button className="btn btn-success" type="submit" disabled={loading}>Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
