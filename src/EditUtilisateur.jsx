import { fetchWithAuth } from "./fetchWithAuth";

import React, { useState, useEffect, useRef } from "react";
import Notification from "./Notification";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function EditUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const successTimeout = useRef();
  const [allGroups, setAllGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [oidcStrict, setOidcStrict] = useState(false);
  const [groupSearch, setGroupSearch] = useState("");
  const [groupAddError, setGroupAddError] = useState("");
  const [groupInputFocused, setGroupInputFocused] = useState(false);

  // Charger l'utilisateur, la liste des groupes et la config OIDC (pour le mode strict)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchWithAuth(`/api/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }),
      fetchWithAuth('/api/groups', { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }),
      fetchWithAuth('/api/iam/auth/oidc')
    ])
      .then(async ([userRes, groupsRes, oidcRes]) => {
        if (!userRes.ok) throw new Error("Erreur lors du chargement de l'utilisateur");
        if (!groupsRes.ok) throw new Error("Erreur lors du chargement des groupes");
        const userData = await userRes.json();
        const groupsData = await groupsRes.json();
        let oidcStrictValue = false;
        if (oidcRes.ok) {
          try {
            const oidcData = await oidcRes.json();
            oidcStrictValue = !!oidcData.strict;
          } catch {}
        }
        setUser(userData);
        setAllGroups(groupsData);
        setSelectedGroupIds(userData.groups ? userData.groups.map(g => g.id) : []);
        setOidcStrict(oidcStrictValue);
        setError("");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setUser(u => ({ ...u, [name]: value }));
  };

  // Gestion du champ actif/inactif via status
  const handleActifChange = () => {
    setUser(u => ({ ...u, status: u.status === "active" ? "inactive" : "active" }));
  };

  // Gestion du multi-select groupes
  const handleGroupChange = e => {
    const value = parseInt(e.target.value, 10);
    if (e.target.checked) {
      setSelectedGroupIds(ids => [...ids, value]);
    } else {
      setSelectedGroupIds(ids => ids.filter(id => id !== value));
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Mettre à jour l'utilisateur et ses groupes en un seul appel
      const payload = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        status: user.status,
        auth_source: user.auth_source,
        groups: selectedGroupIds
      };
      const res = await fetchWithAuth(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      setSuccess(true);
      if (successTimeout.current) clearTimeout(successTimeout.current);
      successTimeout.current = setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (successTimeout.current) clearTimeout(successTimeout.current);
    };
  }, []);

  if (loading) return <div className="container mt-4"><div className="alert alert-info">Chargement...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!user) return null;

  return (
    <div className="container mt-4">
      <Notification
        show={success}
        message="Modifications enregistrées avec succès."
        onClose={() => setSuccess(false)}
      />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam');}}>Gestion IAM</a></li>
          <li className="breadcrumb-item"><a href="#" onClick={e => {e.preventDefault(); navigate('/iam/users');}}>Utilisateurs</a></li>
          <li className="breadcrumb-item active" aria-current="page">Édition</li>
        </ol>
      </nav>
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex align-items-center">
          <FaUser className="me-2" /> Édition de l'utilisateur
          <button className="btn btn-link ms-auto" onClick={() => navigate("/iam/users")} title="Retour"><span aria-hidden="true">&larr;</span> Retour</button>
        </div>
        <form className="card-body" onSubmit={handleSave}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Prénom</label>
              <input className="form-control" name="first_name" value={user.first_name || ""} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nom</label>
              <input className="form-control" name="last_name" value={user.last_name || ""} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input className="form-control" name="email" value={user.email || ""} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Source d'authentification</label>
              <input className="form-control" value={user.auth_source === "oidc" ? "OIDC" : "Locale"} disabled readOnly />
            </div>
          </div>
          <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" id="actif" checked={user.status === "active"} onChange={handleActifChange} />
            <label className="form-check-label" htmlFor="actif">Utilisateur actif</label>
          </div>
          <div className="mt-4">
            <label className="form-label">Groupes</label>
            {oidcStrict ? (
              <div className="alert alert-info mt-2">
                Le mode strict OIDC est actif : les groupes sont gérés automatiquement par OIDC et ne peuvent pas être modifiés manuellement.
              </div>
            ) : (
              <>
                <table className="table table-bordered w-auto">
                  <thead>
                    <tr>
                      <th>Groupe</th>
                      <th>Rôle</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGroupIds.length === 0 ? (
                      <tr><td colSpan={3}><span className="text-muted">Aucun groupe attribué</span></td></tr>
                    ) : (
                      selectedGroupIds.map(gid => {
                        const group = allGroups.find(gr => gr.id === gid);
                        return group ? (
                          <tr key={gid}>
                            <td>{group.name}</td>
                            <td>{group.roles && group.roles.length > 0 ? group.roles.join(", ") : <span className="text-muted">Aucun</span>}</td>
                            <td>
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setSelectedGroupIds(ids => ids.filter(id => id !== gid))}>
                                Retirer
                              </button>
                            </td>
                          </tr>
                        ) : null;
                      })
                    )}
                  </tbody>
                </table>
                <div className="mb-2 position-relative" style={{ maxWidth: 400 }}>
                  <label className="form-label">Ajouter un groupe</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Rechercher un groupe..."
                    value={groupSearch}
                    onChange={e => setGroupSearch(e.target.value)}
                    autoComplete="off"
                    onFocus={e => { setGroupInputFocused(true); e.target.select(); }}
                    onBlur={() => setTimeout(() => setGroupInputFocused(false), 150)}
                    onDoubleClick={() => setGroupSearch("")}
                  />
                  {(groupInputFocused || groupSearch.trim()) && (
                    <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 10, top: '100%' }}>
                      {allGroups
                        .filter(g =>
                          (groupSearch === "" || g.name.toLowerCase().includes(groupSearch.toLowerCase())) &&
                          !selectedGroupIds.includes(g.id)
                        )
                        .slice(0, 8)
                        .map(g => (
                          <li
                            key={g.id}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: 'pointer' }}
                            onMouseDown={e => {
                              setSelectedGroupIds(ids => [...ids, g.id]);
                              setGroupSearch("");
                              setGroupAddError("");
                            }}
                          >
                            {g.name}
                            {g.roles && g.roles.length > 0 && (
                              <span className="badge bg-secondary ms-2">{g.roles.join(", ")}</span>
                            )}
                          </li>
                        ))}
                      {allGroups.filter(g =>
                        (groupSearch === "" || g.name.toLowerCase().includes(groupSearch.toLowerCase())) &&
                        !selectedGroupIds.includes(g.id)
                      ).length === 0 && (
                        <li className="list-group-item text-muted">Aucun groupe trouvé</li>
                      )}
                    </ul>
                  )}
                  {/* Le bouton Ajouter est retiré, le clic sur la suggestion suffit */}
                  {groupAddError && <div className="text-danger mt-1">{groupAddError}</div>}
                </div>
              </>
            )}
          </div>
          <button className="btn btn-success mt-3" type="submit" disabled={saving || oidcStrict}>Enregistrer</button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}
