// Utilitaire pour fetch avec le token d'authentification
export function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("auth_token");
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  return fetch(url, { ...options, headers });
}
