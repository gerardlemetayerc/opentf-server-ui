import React, { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";

// Contexte utilisateur global
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");

  // Stocke le token et l'utilisateur
  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    if (tokenValue) localStorage.setItem("auth_token", tokenValue);
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("auth_token");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook pour utiliser le contexte
export const useUser = () => useContext(UserContext);

// Formulaire de login
export function LoginPage() {
  const [mode] = useState("local");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idToken, setIdToken] = useState("");
  const [error, setError] = useState("");
  const [oidcEnabled, setOidcEnabled] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetch("/api/iam/auth_methods", { method: "GET", credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(methods => {
        const oidc = methods.find(m => m.method === "oidc");
        setOidcEnabled(!!oidc?.enabled);
      })
      .catch(() => setOidcEnabled(false));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    let url = "";
    let body = {};
    if (mode === "local") {
      url = "/api/users/login";
      body = { email, password, auth_source: "locale" };
    } else if (mode === "oidc") {
      url = "/api/users/login_oidc";
      body = { id_token: idToken };
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Authentification échouée");
      const data = await res.json();
      // data peut contenir { token, user }
      login(data.user || null, data.token || "");
      // Redirection après login
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Se connecter</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
      {oidcEnabled && (
        <div className="mt-3 text-center">
          <button type="button" className="btn btn-outline-primary w-100">Authentification avec OpenID</button>
        </div>
      )}
    </div>
  );
}
